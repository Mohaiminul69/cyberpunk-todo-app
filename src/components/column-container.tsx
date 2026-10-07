import { SortableContext, useSortable } from "@dnd-kit/sortable";
import TrashIcon from "../icons/trash-icon";
import type { Column, Id, Rarity, Task } from "../types";
import { CSS } from "@dnd-kit/utilities";
import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type CSSProperties,
} from "react";
import ColorPicker from "./color-picker";
import PlusIcon from "../icons/plus-icon";
import TaskCard from "./task-card";
import TaskForm from "./task-form";
import { playHoverSound, playHoverSound2 } from "../utils/hover-sound";

interface Props {
  column: Column;
  requestDeleteColumn: (column: Column) => void;
  updateColumn: (id: Id, title: string) => void;
  updateColumnColor: (id: Id, color: string) => void;
  updateTask: (id: Id, content: string) => void;
  createTask: (columnId: Id, content: string, rarity: Rarity) => void;
  deleteTask: (id: Id) => void;
  toggleTaskDone: (id: Id) => void;
  tasks: Task[];
  /** "mobile" is the single active column under the tabs */
  variant?: "desktop" | "mobile";
  /** Mobile opens the add-task form from the footer button, so it controls this */
  adding?: boolean;
  onAddingChange?: (adding: boolean) => void;
}

const ColumnContainer = ({
  column,
  requestDeleteColumn,
  updateColumn,
  updateColumnColor,
  createTask,
  tasks,
  deleteTask,
  updateTask,
  toggleTaskDone,
  variant = "desktop",
  adding: addingProp,
  onAddingChange,
}: Props) => {
  const isMobile = variant === "mobile";
  const [editMode, setEditMode] = useState(false);
  const [addingState, setAddingState] = useState(false);
  const adding = addingProp ?? addingState;
  const setAdding = onAddingChange ?? setAddingState;
  const [pickerOpen, setPickerOpen] = useState(false);
  const [previewColor, setPreviewColor] = useState<string | null>(null);
  const colorTriggerRef = useRef<HTMLButtonElement>(null);
  const formRef = useRef<HTMLDivElement>(null);
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: column.id,
    data: {
      type: "column",
      column,
    },
    // Columns can't be reordered on mobile: only one is visible at a time
    disabled: editMode || pickerOpen || isMobile,
  });

  const taskIds = useMemo(() => tasks.map((task) => task.id), [tasks]);
  const cleared = tasks.filter((task) => task.done).length;
  // While the picker is open, the chosen color previews on the column
  const displayColor = previewColor ?? column.color;

  const closePicker = useCallback(() => {
    setPickerOpen(false);
    setPreviewColor(null);
  }, []);

  // The footer button opens the form at the end of a possibly long list
  useEffect(() => {
    if (adding && isMobile) formRef.current?.scrollIntoView({ block: "nearest" });
  }, [adding, isMobile]);

  const style = {
    transition,
    transform: CSS.Transform.toString(transform),
    "--col": displayColor,
  } as CSSProperties;

  const columnClass =
    "relative flex max-h-full min-h-[min(480px,100%)] w-79.5 flex-none flex-col border-t-3 border-(--col) bg-hud-panel";

  if (isDragging) {
    return (
      <div ref={setNodeRef} style={style} className={`${columnClass} opacity-40`} />
    );
  }

  const titleClass = isMobile
    ? "text-xl font-extrabold font-stretch-118% tracking-[.04em] uppercase"
    : "text-base font-extrabold font-stretch-118% tracking-[.06em] uppercase";

  const title = editMode ? (
    <input
      className={`min-w-0 flex-1 border-b-2 border-(--col) bg-transparent caret-hud-accent outline-none ${titleClass}`}
      value={column.title}
      onChange={(e) => updateColumn(column.id, e.target.value)}
      autoFocus
      onBlur={() => setEditMode(false)}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === "Escape") setEditMode(false);
      }}
    />
  ) : (
    <div
      onClick={() => setEditMode(true)}
      title="Click to rename"
      className={`min-w-0 cursor-text truncate ${isMobile ? "" : "flex-1"} ${titleClass}`}
    >
      {column.title}
    </div>
  );

  const clearedLabel = (
    <span
      className={`shrink-0 text-[10px] font-bold tracking-[.12em] tabular-nums ${
        cleared > 0 ? "text-(--col)" : "text-hud-muted-2"
      }`}
    >
      {cleared}/{tasks.length} CLEARED
    </span>
  );

  const actions = (
    <div className={`flex shrink-0 ${isMobile ? "ml-auto" : ""}`}>
      <button
        ref={colorTriggerRef}
        onClick={() => (pickerOpen ? closePicker() : setPickerOpen(true))}
        onMouseEnter={playHoverSound}
        title="Change column color"
        aria-label="Change column color"
        aria-expanded={pickerOpen}
        className={`grid cursor-pointer place-items-center transition-colors hover:bg-hud-line ${
          isMobile ? "size-11" : "size-8"
        } ${pickerOpen ? "bg-hud-line" : ""}`}
      >
        <span
          className={`bg-(--col) shadow-[0_0_0_2px_#141212,0_0_0_3px_#605d5d] ${
            isMobile ? "size-4" : "size-3.5"
          }`}
        />
      </button>
      <button
        onClick={() => requestDeleteColumn(column)}
        onMouseEnter={playHoverSound}
        aria-label={`Delete ${column.title}`}
        className={`grid cursor-pointer place-items-center text-hud-muted-2 transition-colors hover:bg-hud-line hover:text-hud-accent-on-dark ${
          isMobile ? "size-11" : "size-8"
        }`}
      >
        <TrashIcon size={isMobile ? 18 : 17} />
      </button>
    </div>
  );

  const picker = pickerOpen && (
    <ColorPicker
      value={displayColor}
      variant={isMobile ? "sheet" : "popover"}
      triggerRef={colorTriggerRef}
      onPreview={setPreviewColor}
      onApply={(color) => {
        updateColumnColor(column.id, color);
        closePicker();
      }}
      onCancel={closePicker}
    />
  );

  const taskList = (
    <>
      <SortableContext items={taskIds}>
        {tasks.map((task, index) => (
          <TaskCard
            updateTask={updateTask}
            key={task.id}
            task={task}
            taskNumber={index + 1}
            deleteTask={deleteTask}
            toggleTaskDone={toggleTaskDone}
          />
        ))}
      </SortableContext>
      {adding && (
        <div ref={formRef}>
          <TaskForm
            onSubmit={(content, rarity) => createTask(column.id, content, rarity)}
            onCancel={() => setAdding(false)}
          />
        </div>
      )}
    </>
  );

  if (isMobile) {
    return (
      <div ref={setNodeRef} style={style} className="flex min-h-0 flex-1 flex-col">
        <div className="flex items-center gap-2.5 pt-1 pb-3">
          {title}
          {!editMode && clearedLabel}
          {actions}
        </div>
        {picker}
        <div className="quest-list flex min-h-0 flex-1 flex-col gap-2.5 overflow-y-auto pb-4">
          {taskList}
          {tasks.length === 0 && !adding && (
            <p className="py-10 text-center text-xs font-bold tracking-[.12em] text-hud-muted-2">
              NO QUESTS YET
            </p>
          )}
        </div>
      </div>
    );
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      onMouseEnter={playHoverSound2}
      className={columnClass}
    >
      <div
        {...attributes}
        {...listeners}
        className="flex cursor-grab items-center gap-3 px-4 pt-3.5 pb-2.5"
      >
        <div className="grid size-7 shrink-0 place-items-center border-2 border-(--col) text-[13px] font-extrabold text-(--col) tabular-nums">
          {tasks.length}
        </div>
        {title}
        {actions}
      </div>

      {picker}

      <div className="flex items-center gap-2.5 border-b-2 border-hud-line px-4 pb-3.5">
        <div className="relative h-0.75 flex-1 bg-hud-line">
          <div
            className="absolute inset-y-0 left-0 bg-(--col) transition-[width] duration-600 ease-[cubic-bezier(.2,.8,.2,1)]"
            style={{ width: tasks.length ? `${(cleared / tasks.length) * 100}%` : 0 }}
          />
        </div>
        {clearedLabel}
      </div>

      <div className="quest-list flex min-h-0 flex-col gap-2.5 overflow-y-auto px-4 py-3.5">
        {taskList}
        {!adding && (
          <button
            onClick={() => setAdding(true)}
            onMouseEnter={playHoverSound}
            className="flex shrink-0 cursor-pointer items-center gap-2.5 border border-dashed border-hud-idle p-3.5 text-xs font-extrabold tracking-[.12em] text-(--col) transition-colors hover:border-(--col) hover:bg-hud-hover-fill"
          >
            <PlusIcon />
            ADD TASK
          </button>
        )}
      </div>
    </div>
  );
};

export default ColumnContainer;
