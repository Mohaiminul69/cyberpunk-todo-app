import { useEffect, useRef, useState, type RefObject } from "react";
import { COLUMN_COLOR_PRESETS } from "../game";
import { contrastRatio, normalizeHex } from "../utils/color";
import CheckIcon from "../icons/check-icon";

const BACKGROUND = "#141212";

interface Props {
  /** Color currently shown on the column (the live preview) */
  value: string;
  onPreview: (color: string) => void;
  onApply: (color: string) => void;
  onCancel: () => void;
  /** The trigger button, so clicking it isn't treated as an outside click */
  triggerRef: RefObject<HTMLElement | null>;
}

/**
 * Column color popover: 8 presets plus a custom hex field. Choices preview live
 * on the column; Apply keeps them, Cancel / Esc / clicking outside reverts.
 */
const ColorPicker = ({ value, onPreview, onApply, onCancel, triggerRef }: Props) => {
  const ref = useRef<HTMLDivElement>(null);
  const [customText, setCustomText] = useState(() =>
    value.startsWith("#") ? value.toUpperCase() : "",
  );

  const customHex = normalizeHex(customText);
  const customInvalid = customText.trim() !== "" && !customHex;
  const lowContrast =
    customHex !== null && contrastRatio(customHex, BACKGROUND) < 3;
  const presetName = COLUMN_COLOR_PRESETS.find(
    (preset) => preset.value.toLowerCase() === value.toLowerCase(),
  )?.name;

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onCancel();
    };
    const onPointerDown = (e: PointerEvent) => {
      const target = e.target as Node;
      if (ref.current?.contains(target) || triggerRef.current?.contains(target)) {
        return;
      }
      onCancel();
    };
    document.addEventListener("keydown", onKeyDown);
    document.addEventListener("pointerdown", onPointerDown);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.removeEventListener("pointerdown", onPointerDown);
    };
  }, [onCancel, triggerRef]);

  const choosePreset = (color: string) => {
    setCustomText(color.startsWith("#") ? color.toUpperCase() : "");
    onPreview(color);
  };

  const changeCustom = (text: string) => {
    setCustomText(text);
    const hex = normalizeHex(text);
    if (hex) onPreview(hex);
  };

  const apply = () => {
    if (!customInvalid) onApply(value);
  };

  return (
    <div
      ref={ref}
      role="dialog"
      aria-label="Column color"
      className="absolute top-13 right-3 z-10 flex w-66 flex-col gap-3.5 border-2 border-hud-line-strong bg-hud-panel-raised p-4 shadow-[0_12px_32px_rgba(0,0,0,.6)]"
    >
      <div className="flex items-center justify-between">
        <span className="text-[10px] font-extrabold tracking-[.16em] text-hud-muted">
          COLUMN COLOR
        </span>
        <span className="text-[11px] font-bold tracking-[.08em] text-(--col)">
          {presetName ?? "CUSTOM"}
        </span>
      </div>

      <div className="grid grid-cols-4 gap-2">
        {COLUMN_COLOR_PRESETS.map((preset) => {
          const selected = preset.value.toLowerCase() === value.toLowerCase();
          return (
            <button
              key={preset.name}
              type="button"
              title={preset.name.charAt(0) + preset.name.slice(1).toLowerCase()}
              aria-label={preset.name}
              aria-pressed={selected}
              onClick={() => choosePreset(preset.value)}
              className={`grid h-10 cursor-pointer place-items-center text-hud-bg ${
                selected
                  ? "shadow-[0_0_0_2px_#1d1b1b,0_0_0_4px_#f3f2f2]"
                  : "hover:shadow-[0_0_0_2px_#1d1b1b,0_0_0_4px_#605d5d]"
              }`}
              style={{ background: preset.value }}
            >
              {selected && <CheckIcon size={16} strokeWidth={3} />}
            </button>
          );
        })}
      </div>

      <div className="flex flex-col gap-1.5">
        <label
          htmlFor="column-color-custom"
          className="text-[10px] font-extrabold tracking-[.16em] text-hud-muted"
        >
          CUSTOM
        </label>
        <div className="flex gap-0.5">
          <div className="h-9 w-10 flex-none bg-(--col)" />
          <input
            id="column-color-custom"
            value={customText}
            onChange={(e) => changeCustom(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") apply();
            }}
            placeholder="#RRGGBB"
            spellCheck={false}
            aria-invalid={customInvalid}
            className={`h-9 min-w-0 flex-1 border bg-hud-card px-2.5 text-[13px] font-semibold tracking-[.06em] text-hud-ink uppercase tabular-nums caret-hud-accent outline-none placeholder:text-hud-idle ${
              customInvalid ? "border-hud-accent-on-dark" : "border-hud-line-strong focus:border-hud-muted"
            }`}
          />
        </div>
        {customInvalid && (
          <span className="text-[11px] text-hud-accent-on-dark">
            Use #RGB or #RRGGBB
          </span>
        )}
        {lowContrast && (
          <span className="text-[11px] text-hud-amber">
            Low contrast on the dark background
          </span>
        )}
      </div>

      <div className="flex gap-0.5">
        <button
          type="button"
          onClick={apply}
          disabled={customInvalid}
          className="flex h-9 flex-1 cursor-pointer items-center bg-hud-accent px-3 text-xs font-extrabold tracking-[.12em] text-hud-ink hover:bg-hud-accent-on-dark disabled:cursor-not-allowed disabled:opacity-45"
        >
          APPLY
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="flex h-9 flex-1 cursor-pointer items-center border border-hud-line-strong px-3 text-xs font-extrabold tracking-[.12em] text-hud-ink-3 hover:bg-hud-hover-fill"
        >
          CANCEL
        </button>
      </div>
    </div>
  );
};

export default ColorPicker;
