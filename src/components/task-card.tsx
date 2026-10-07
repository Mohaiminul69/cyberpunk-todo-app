import { useEffect, useState } from "react";
import type { Id, Task } from "../types";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import MicrophoneButton from "./microphone-button";
import { playHoverSound } from "../utils/hover-sound";
import { RARITIES } from "../game";
import CheckIcon from "../icons/check-icon";
import TrashIcon from "../icons/trash-icon";
import RarityTag from "./rarity-tag";

interface Props {
  task: Task;
  taskNumber: number;
  deleteTask: (id: Id) => void;
  updateTask: (id: Id, content: string) => void;
  toggleTaskDone: (id: Id) => void;
}

const TaskCard = ({
  task,
  taskNumber,
  deleteTask,
  updateTask,
  toggleTaskDone,
}: Props) => {
  const [editMode, setEditMode] = useState(false);
  // Bumped on each completion to replay the flash and "+N XP" float
  const [celebrateKey, setCelebrateKey] = useState(0);
  const rarity = RARITIES[task.rarity];

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: task.id,
    data: {
      type: "task",
      task,
    },
    disabled: editMode,
  });

  useEffect(() => {
    if (!celebrateKey) return;
    const timeout = setTimeout(() => setCelebrateKey(0), 700);
    return () => clearTimeout(timeout);
  }, [celebrateKey]);

  const style = {
    transition,
    transform: CSS.Transform.toString(transform),
  };

  const handleToggleDone = () => {
    if (!task.done) setCelebrateKey(Date.now());
    toggleTaskDone(task.id);
  };

  const appendTranscript = (transcript: string) => {
    const content = task.content
      ? `${task.content} ${transcript}`
      : transcript.charAt(0).toUpperCase() + transcript.slice(1);
    updateTask(task.id, content);
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      onMouseEnter={playHoverSound}
      className={`group relative shrink-0 ${editMode ? "" : "cursor-grab"} ${isDragging ? "opacity-30" : ""}`}
    >
      <div
        className={`quest-card ${task.done ? "quest-card-done" : ""} ${celebrateKey ? "quest-card-flash" : ""}`}
      >
        <div className="flex items-center gap-2">
          <button
            onClick={handleToggleDone}
            aria-label={task.done ? "Mark as not done" : "Mark as done"}
            aria-pressed={task.done}
            className={`grid size-4.5 shrink-0 cursor-pointer place-items-center transition-colors md:size-4 duration-120 ease-out ${
              task.done
                ? "bg-(--col) text-hud-bg"
                : "border-2 border-hud-idle hover:border-(--col)"
            } ${celebrateKey ? "check-pop" : ""}`}
          >
            {task.done && <CheckIcon />}
          </button>
          <span className="text-xs font-bold text-(--col) tabular-nums">
            #{String(taskNumber).padStart(2, "0")}
          </span>
          <button
            onClick={() => deleteTask(task.id)}
            aria-label="Delete task"
            className="ml-auto grid size-6 cursor-pointer place-items-center text-hud-muted-2 transition hover:text-hud-accent-on-dark md:size-5 md:opacity-0 md:group-hover:opacity-100 md:focus-visible:opacity-100"
          >
            <TrashIcon size={13} />
          </button>
          <RarityTag rarity={task.rarity} />
        </div>

        {editMode ? (
          <div className="relative">
            <textarea
              value={task.content}
              autoFocus
              placeholder="Task content here"
              onBlur={() => setEditMode(false)}
              onKeyDown={(e) => {
                if ((e.key === "Enter" && !e.shiftKey) || e.key === "Escape") {
                  e.preventDefault();
                  setEditMode(false);
                }
              }}
              onChange={(e) => updateTask(task.id, e.target.value)}
              className="block min-h-11 w-full resize-none bg-transparent pr-7 text-base leading-[1.45] text-hud-ink-2 caret-hud-accent outline-none field-sizing-content md:text-sm placeholder:text-hud-muted-2"
            ></textarea>
            <MicrophoneButton onTranscript={appendTranscript} />
          </div>
        ) : (
          <p
            onClick={() => setEditMode(true)}
            className={`cursor-text text-[15px] leading-[1.45] md:text-sm break-words whitespace-pre-wrap text-pretty ${
              task.done
                ? "text-hud-muted-2 line-through decoration-(--col)"
                : "text-hud-ink-2"
            }`}
          >
            {task.content}
          </p>
        )}

        <div className="flex items-center gap-0.75">
          {Array.from({ length: 4 }, (_, i) => (
            <div
              key={i}
              className="h-1 w-3"
              style={{
                background: i < rarity.pips ? rarity.color : "var(--color-hud-line)",
              }}
            />
          ))}
          {task.done ? (
            <span className="ml-auto bg-(--col) px-1.5 py-0.5 text-[11px] font-extrabold tracking-[.08em] text-hud-bg">
              +{rarity.xp} XP CLAIMED
            </span>
          ) : (
            <span
              className={`ml-auto text-[11px] font-semibold ${
                task.rarity === "legendary" ? "text-hud-amber" : "text-hud-muted"
              }`}
            >
              +{rarity.xp} XP
            </span>
          )}
        </div>
      </div>

      {celebrateKey > 0 && (
        <span
          key={celebrateKey}
          className="xp-float pointer-events-none absolute right-3.5 bottom-3 text-sm font-black font-stretch-125% text-(--col)"
        >
          +{rarity.xp} XP
        </span>
      )}
    </div>
  );
};

export default TaskCard;
