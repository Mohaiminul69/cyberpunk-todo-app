import { useEffect, useRef, useState, type ComponentProps } from "react";
import type { Column, Id, Task } from "../types";
import ColumnContainer from "./column-container";
import PlusIcon from "../icons/plus-icon";

type ColumnProps = Omit<
  ComponentProps<typeof ColumnContainer>,
  "column" | "tasks" | "variant" | "adding" | "onAddingChange"
>;

interface Props {
  columns: Column[];
  tasks: Task[];
  activeColumnId: Id | null;
  setActiveColumnId: (id: Id) => void;
  createColumn: () => void;
  columnProps: ColumnProps;
}

const SWIPE_DISTANCE = 60;

/** Under 768px: one column at a time, picked with tabs or by swiping */
const MobileBoard = ({
  columns,
  tasks,
  activeColumnId,
  setActiveColumnId,
  createColumn,
  columnProps,
}: Props) => {
  const [adding, setAdding] = useState(false);
  const touchStart = useRef<{ x: number; y: number } | null>(null);
  const tabRefs = useRef(new Map<Id, HTMLButtonElement>());

  const activeIndex = columns.findIndex((col) => col.id === activeColumnId);
  const activeColumn = columns[activeIndex];

  // Keep the active tab visible in the scrolling tab row
  useEffect(() => {
    if (activeColumnId === null) return;
    tabRefs.current
      .get(activeColumnId)
      ?.scrollIntoView({ inline: "nearest", block: "nearest", behavior: "smooth" });
  }, [activeColumnId]);

  const goTo = (index: number) => {
    const column = columns[index];
    if (!column) return;
    setAdding(false);
    setActiveColumnId(column.id);
  };

  const onTouchStart = (e: React.TouchEvent) => {
    // Touches in portalled UI (the color sheet) bubble here through React; skip them
    if (!e.currentTarget.contains(e.target as Node)) return;
    const touch = e.touches[0];
    touchStart.current = { x: touch.clientX, y: touch.clientY };
  };

  // A mostly-horizontal swipe switches columns (left = next, right = previous)
  const onTouchEnd = (e: React.TouchEvent) => {
    const start = touchStart.current;
    touchStart.current = null;
    if (!start) return;
    const touch = e.changedTouches[0];
    const dx = touch.clientX - start.x;
    const dy = touch.clientY - start.y;
    if (Math.abs(dx) < SWIPE_DISTANCE || Math.abs(dx) < Math.abs(dy) * 1.5) return;
    goTo(activeIndex + (dx < 0 ? 1 : -1));
  };

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      {/* Column tabs */}
      <div className="no-scrollbar -mx-5 flex shrink-0 gap-0.5 overflow-x-auto px-5 py-3.5">
        {columns.map((column) => {
          const active = column.id === activeColumnId;
          const count = tasks.filter((task) => task.columnId === column.id).length;
          return (
            <button
              key={column.id}
              ref={(el) => {
                if (el) tabRefs.current.set(column.id, el);
                else tabRefs.current.delete(column.id);
              }}
              onClick={() => goTo(columns.indexOf(column))}
              aria-current={active ? "page" : undefined}
              className={`flex h-11 max-w-40 flex-none cursor-pointer items-center gap-2 px-3.5 text-xs font-extrabold tracking-[.08em] uppercase ${
                active
                  ? "text-hud-bg"
                  : "border-b-3 bg-hud-panel text-hud-muted"
              }`}
              style={
                active
                  ? { background: column.color }
                  : { borderBottomColor: column.color }
              }
            >
              <span className="truncate">{column.title}</span>
              <span
                className="tabular-nums"
                style={active ? undefined : { color: column.color }}
              >
                {count}
              </span>
            </button>
          );
        })}
        <button
          onClick={createColumn}
          aria-label="New column"
          className="grid h-11 w-11 flex-none cursor-pointer place-items-center border border-dashed border-hud-line-strong text-hud-muted active:text-hud-ink"
        >
          <PlusIcon />
        </button>
      </div>

      {activeColumn ? (
        <div
          onTouchStart={onTouchStart}
          onTouchEnd={onTouchEnd}
          // Vertical scrolling stays native; horizontal swipes are ours
          className="flex min-h-0 flex-1 touch-pan-y flex-col"
        >
          <ColumnContainer
            key={activeColumn.id}
            column={activeColumn}
            {...columnProps}
            tasks={tasks.filter((task) => task.columnId === activeColumn.id)}
            variant="mobile"
            adding={adding}
            onAddingChange={setAdding}
          />
        </div>
      ) : (
        <button
          onClick={createColumn}
          className="mt-2 flex h-30 cursor-pointer flex-col items-start justify-end gap-2 border border-dashed border-hud-line-strong p-4 text-xs font-extrabold tracking-[.12em] text-hud-muted"
        >
          <PlusIcon size={20} />
          NEW COLUMN
        </button>
      )}

      {/* Footer: page dots + add task */}
      {activeColumn && (
        <div className="flex shrink-0 flex-col gap-3 pt-4 pb-[calc(16px+env(safe-area-inset-bottom))]">
          <div className="flex justify-center gap-1.5">
            {columns.map((column, index) => (
              <button
                key={column.id}
                onClick={() => goTo(index)}
                aria-label={`Go to ${column.title}`}
                className={`h-1.5 cursor-pointer ${index === activeIndex ? "w-4.5" : "w-1.5 bg-hud-line-strong"}`}
                style={index === activeIndex ? { background: column.color } : undefined}
              />
            ))}
          </div>
          <button
            onClick={() => setAdding(true)}
            className="flex h-14 cursor-pointer items-center gap-2.5 bg-hud-accent px-4.5 text-sm font-extrabold tracking-[.12em] text-hud-ink active:bg-hud-accent-deep"
          >
            <PlusIcon size={18} />
            ADD TASK
            <span className="ml-auto truncate text-[11px] font-semibold tracking-[.08em] uppercase opacity-85">
              TO {activeColumn.title}
            </span>
          </button>
        </div>
      )}
    </div>
  );
};

export default MobileBoard;
