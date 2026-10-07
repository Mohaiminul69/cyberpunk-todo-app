import { useState } from "react";
import type { Rarity } from "../types";
import { RARITIES, RARITY_ORDER } from "../game";
import MicrophoneButton from "./microphone-button";
import { playHoverSound2 } from "../utils/hover-sound";

interface Props {
  onSubmit: (content: string, rarity: Rarity) => void;
  onCancel: () => void;
}

/** Inline "add task" form: text, rarity picker, submit. Enter submits, Esc cancels. */
const TaskForm = ({ onSubmit, onCancel }: Props) => {
  const [text, setText] = useState("");
  const [rarity, setRarity] = useState<Rarity>("common");
  const canSubmit = text.trim().length > 0;

  const submit = () => {
    if (!canSubmit) return;
    onSubmit(text.trim(), rarity);
    // Stay open with the same rarity for quick entry of several tasks
    setText("");
  };

  const appendTranscript = (transcript: string) =>
    setText((prev) =>
      prev
        ? `${prev} ${transcript}`
        : transcript.charAt(0).toUpperCase() + transcript.slice(1),
    );

  return (
    <form
      onMouseEnter={playHoverSound2}
      onSubmit={(e) => {
        e.preventDefault();
        submit();
      }}
      onKeyDown={(e) => {
        if (e.key === "Escape") onCancel();
      }}
      className="flex shrink-0 flex-col gap-2.5 bg-hud-card p-3.5 shadow-[inset_0_0_0_1px_var(--col)]"
    >
      <div className="relative">
        <textarea
          value={text}
          autoFocus
          placeholder="New quest..."
          onChange={(e) => setText(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              submit();
            }
          }}
          className="block min-h-11 w-full resize-none border-b border-hud-line bg-transparent pr-7 pb-2 text-base leading-[1.45] text-hud-ink-2 md:text-sm caret-hud-accent outline-none field-sizing-content placeholder:text-hud-muted-2 focus:border-(--col)"
        />
        <MicrophoneButton onTranscript={appendTranscript} />
      </div>

      <div role="radiogroup" aria-label="Rarity" className="grid grid-cols-4 gap-0.5">
        {RARITY_ORDER.map((key) => {
          const { label, color } = RARITIES[key];
          const selected = key === rarity;
          return (
            <button
              key={key}
              type="button"
              role="radio"
              aria-checked={selected}
              onClick={() => setRarity(key)}
              className="cursor-pointer py-1.5 text-[9px] font-bold tracking-[.1em] transition-colors"
              style={
                selected
                  ? { background: color, color: "var(--color-hud-bg)" }
                  : { background: "var(--color-hud-line)", color }
              }
            >
              {label}
            </button>
          );
        })}
      </div>

      <div className="flex gap-0.5">
        <button
          type="submit"
          disabled={!canSubmit}
          className="flex-1 cursor-pointer bg-hud-accent px-3 py-2 text-left text-xs font-extrabold tracking-[.12em] text-hud-ink transition-colors hover:bg-[#dd2b0f] active:bg-hud-accent-deep disabled:cursor-not-allowed disabled:opacity-45"
        >
          ADD QUEST
          <span className="float-right text-[10px] font-semibold tracking-[.08em] opacity-85">
            +{RARITIES[rarity].xp} XP
          </span>
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="cursor-pointer px-3 py-2 text-xs font-extrabold tracking-[.12em] text-hud-muted transition-colors hover:bg-hud-hover-fill hover:text-hud-ink"
        >
          CANCEL
        </button>
      </div>
    </form>
  );
};

export default TaskForm;
