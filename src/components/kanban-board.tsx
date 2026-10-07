import { useMemo, useRef, useState, type CSSProperties } from "react";
import PlusIcon from "./../icons/plus-icon";
import type { Column, Id, Rarity, Task } from "../types";
import ColumnContainer from "./column-container";
import {
  DndContext,
  DragOverlay,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
  type DragOverEvent,
  type DragStartEvent,
} from "@dnd-kit/core";
import { arrayMove, SortableContext } from "@dnd-kit/sortable";
import { createPortal } from "react-dom";
import TaskCard from "./task-card";
import BoardMeta from "./board-meta";
import ScrollTrack from "./scroll-track";
import ConfirmDialog from "./confirm-dialog";
import { COLUMN_COLORS, RARITIES } from "../game";
import { useIsMobile } from "../hooks/use-media-query";
import MobileBoard from "./mobile-board";

interface Props {
  dailyCompleted: number;
  onTaskCompleted: (xp: number) => void;
  onTaskUncompleted: (xp: number, completedAt?: number) => void;
}

const KanbanBoard = ({
  dailyCompleted,
  onTaskCompleted,
  onTaskUncompleted,
}: Props) => {
  const [columns, setColumns] = useState<Column[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [activeColumn, setActiveColumn] = useState<Column | null>(null);
  const [activeTask, setActiveTask] = useState<Task | null>(null);
  const [columnToDelete, setColumnToDelete] = useState<Column | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  // activeTask is a snapshot from drag start; read the live copy so the
  // overlay follows the task as it moves between columns
  const draggedTask = activeTask
    ? (tasks.find((task) => task.id === activeTask.id) ?? activeTask)
    : null;
  const columnsId = useMemo(
    () => columns.map((column) => column.id),
    [columns],
  );

  const isMobile = useIsMobile();
  // Mobile shows one column; fall back to the first if none is picked (or it was deleted)
  const [mobileColumnId, setMobileColumnId] = useState<Id | null>(null);
  const activeMobileColumnId = columns.some((col) => col.id === mobileColumnId)
    ? mobileColumnId
    : (columns[0]?.id ?? null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      // On touch, press and hold to drag so scrolling and swiping still work
      activationConstraint: isMobile
        ? { delay: 250, tolerance: 5 }
        : { distance: 3 },
    }),
  );

  const createTask = (columnId: Id, content: string, rarity: Rarity) => {
    const newTask: Task = {
      id: crypto.randomUUID(),
      content,
      columnId,
      rarity,
      done: false,
    };
    setTasks((prevTasks) => [...prevTasks, newTask]);
  };

  const createColumn = () => {
    const columnToAdd: Column = {
      id: crypto.randomUUID(),
      title: `Column ${columns.length + 1}`,
      color: COLUMN_COLORS[columns.length % COLUMN_COLORS.length],
    };
    setColumns((prevColumns) => [...prevColumns, columnToAdd]);
    setMobileColumnId(columnToAdd.id);
  };

  // Earned XP is kept when a column and its tasks are deleted
  const deleteColumn = (id: Id) => {
    const filteredColumns = columns.filter((column) => column.id !== id);
    setColumns(filteredColumns);
    const newTasks = tasks.filter((task) => task.columnId !== id);
    setTasks(newTasks);
  };

  const deleteTask = (id: Id) => {
    const filteredTasks = tasks.filter((task) => task.id !== id);
    setTasks(filteredTasks);
  };

  const updateColumn = (id: Id, title: string) => {
    const newColumns = columns.map((column) => {
      if (column.id !== id) return column;
      return { ...column, title };
    });
    setColumns(newColumns);
  };

  const updateColumnColor = (id: Id, color: string) => {
    setColumns((prevColumns) =>
      prevColumns.map((column) =>
        column.id === id ? { ...column, color } : column,
      ),
    );
  };

  const updateTask = (id: Id, content: string) => {
    const newTasks = tasks.map((task) => {
      if (task.id !== id) return task;
      return { ...task, content };
    });
    setTasks(newTasks);
  };

  const toggleTaskDone = (id: Id) => {
    const task = tasks.find((t) => t.id === id);
    if (!task) return;
    const xp = RARITIES[task.rarity].xp;

    if (task.done) {
      onTaskUncompleted(xp, task.completedAt);
    } else {
      onTaskCompleted(xp);
    }

    setTasks((prevTasks) =>
      prevTasks.map((t) =>
        t.id === id
          ? { ...t, done: !t.done, completedAt: t.done ? undefined : Date.now() }
          : t,
      ),
    );
  };

  const onDragStart = (event: DragStartEvent) => {
    if (event.active.data.current?.type === "column") {
      setActiveColumn(event.active.data.current.column);
      return;
    }

    if (event.active.data.current?.type === "task") {
      setActiveTask(event.active.data.current.task);
      return;
    }
  };

  const onDragEnd = (event: DragEndEvent) => {
    setActiveColumn(null);
    setActiveTask(null);
    const { active, over } = event;

    if (!over) return;

    // Task moves are handled in onDragOver; only column drags reorder columns
    if (active.data.current?.type !== "column") return;

    const activeColumnId = active.id;
    const overColumnId = over.id;

    if (activeColumnId === overColumnId) return;

    setColumns((prevColumns) => {
      const activeColumnIndex = prevColumns.findIndex(
        (col) => col.id === activeColumnId,
      );
      const overColumnIndex = prevColumns.findIndex(
        (col) => col.id === overColumnId,
      );

      if (activeColumnIndex === -1 || overColumnIndex === -1) return prevColumns;

      return arrayMove(prevColumns, activeColumnIndex, overColumnIndex);
    });
  };

  const onDragOver = (event: DragOverEvent) => {
    const { active, over } = event;

    if (!over) return;

    const activeTaskId = active.id;
    const overTaskId = over.id;

    if (activeTaskId === overTaskId) return;

    const isActiveTask = active.data.current?.type === "task";
    const isOverTask = over.data.current?.type === "task";

    if (!isActiveTask) return;

    if (isActiveTask && isOverTask) {
      setTasks((prevTasks) => {
        const activeTaskIndex = prevTasks.findIndex(
          (task) => task.id === activeTaskId,
        );
        const overTaskIndex = prevTasks.findIndex(
          (task) => task.id === overTaskId,
        );

        if (activeTaskIndex === -1 || overTaskIndex === -1) return prevTasks;

        const newTasks = [...prevTasks];
        newTasks[activeTaskIndex] = {
          ...newTasks[activeTaskIndex],
          columnId: newTasks[overTaskIndex].columnId,
        };

        return arrayMove(newTasks, activeTaskIndex, overTaskIndex);
      });
    }

    const isOverAColumn = over.data.current?.type === "column";

    if (isActiveTask && isOverAColumn) {
      setTasks((prevTasks) =>
        prevTasks.map((task) =>
          task.id === activeTaskId ? { ...task, columnId: overTaskId } : task,
        ),
      );
    }
  };

  const columnProps = {
    requestDeleteColumn: setColumnToDelete,
    updateColumn,
    updateColumnColor,
    createTask,
    deleteTask,
    updateTask,
    toggleTaskDone,
  };

  const tasksToDelete = columnToDelete
    ? tasks.filter((task) => task.columnId === columnToDelete.id).length
    : 0;

  const dragOverlay = createPortal(
    <DragOverlay>
      {activeColumn && (
        <ColumnContainer
          column={activeColumn}
          {...columnProps}
          tasks={tasks.filter((task) => task.columnId === activeColumn.id)}
        />
      )}
      {draggedTask && (
        // The overlay is portalled outside its column, so pass the color explicitly
        <div
          className="font-archivo"
          style={
            {
              "--col": columns.find((col) => col.id === draggedTask.columnId)
                ?.color,
            } as CSSProperties
          }
        >
          <TaskCard
            task={draggedTask}
            taskNumber={
              tasks
                .filter((task) => task.columnId === draggedTask.columnId)
                .findIndex((task) => task.id === draggedTask.id) + 1
            }
            deleteTask={deleteTask}
            updateTask={updateTask}
            toggleTaskDone={toggleTaskDone}
          />
        </div>
      )}
    </DragOverlay>,
    document.body,
  );

  const deleteDialog = columnToDelete && (
    <ConfirmDialog
      title="Delete column?"
      body={`Delete ${columnToDelete.title.toUpperCase()} and its ${tasksToDelete} ${
        tasksToDelete === 1 ? "task" : "tasks"
      }? Earned XP is kept.`}
      confirmLabel="Delete"
      onConfirm={() => {
        deleteColumn(columnToDelete.id);
        setColumnToDelete(null);
      }}
      onCancel={() => setColumnToDelete(null)}
    />
  );

  if (isMobile) {
    return (
      <DndContext
        sensors={sensors}
        onDragStart={onDragStart}
        onDragEnd={onDragEnd}
        onDragOver={onDragOver}
      >
        <MobileBoard
          columns={columns}
          tasks={tasks}
          activeColumnId={activeMobileColumnId}
          setActiveColumnId={setMobileColumnId}
          createColumn={createColumn}
          columnProps={columnProps}
        />
        {dragOverlay}
        {deleteDialog}
      </DndContext>
    );
  }

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <BoardMeta
        columnCount={columns.length}
        taskCount={tasks.length}
        dailyCompleted={dailyCompleted}
      />

      <div
        ref={scrollRef}
        className="no-scrollbar -mx-10 flex min-h-0 flex-1 overflow-x-auto overflow-y-hidden px-10 pt-1 pb-5"
      >
        <DndContext
          sensors={sensors}
          onDragStart={onDragStart}
          onDragEnd={onDragEnd}
          onDragOver={onDragOver}
        >
          <div className="flex h-full items-start gap-5">
            <SortableContext items={columnsId}>
              {columns.map((column) => (
                <ColumnContainer
                  key={column.id}
                  column={column}
                  {...columnProps}
                  tasks={tasks.filter((task) => task.columnId === column.id)}
                />
              ))}
            </SortableContext>
            <button
              onClick={createColumn}
              className="flex h-30 w-50 flex-none cursor-pointer flex-col items-start justify-end gap-2 border border-dashed border-hud-line-strong p-4 text-xs font-extrabold tracking-[.12em] text-hud-muted transition-colors hover:border-hud-muted hover:text-hud-ink"
            >
              <PlusIcon size={20} />
              NEW COLUMN
            </button>
          </div>
          {dragOverlay}
        </DndContext>
      </div>

      <ScrollTrack scrollRef={scrollRef} />

      {deleteDialog}
    </div>
  );
};

export default KanbanBoard;
