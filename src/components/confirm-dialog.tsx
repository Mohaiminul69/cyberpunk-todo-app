import { useEffect } from "react";
import { createPortal } from "react-dom";

interface Props {
  title: string;
  body: string;
  confirmLabel: string;
  onConfirm: () => void;
  onCancel: () => void;
}

/** Modernist-style dialog: light surface, 0 radius, Esc or backdrop click cancels */
const ConfirmDialog = ({ title, body, confirmLabel, onConfirm, onCancel }: Props) => {
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onCancel();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [onCancel]);

  return createPortal(
    <div
      onClick={onCancel}
      className="fixed inset-0 z-50 grid place-items-center bg-hud-line/50 p-4 font-archivo"
    >
      <div
        role="alertdialog"
        aria-modal="true"
        aria-labelledby="confirm-dialog-title"
        onClick={(e) => e.stopPropagation()}
        className="flex w-[min(440px,100%)] flex-col gap-3 bg-[#eae9e9] p-4 text-[#201e1d] shadow-[0_12px_32px_rgba(0,0,0,.5)]"
      >
        <div id="confirm-dialog-title" className="text-xl font-extrabold">
          {title}
        </div>
        <div className="text-sm opacity-85">{body}</div>
        <div className="mt-2 flex justify-end gap-2">
          <button
            autoFocus
            onClick={onCancel}
            className="cursor-pointer border border-[#201e1d]/40 px-3.5 py-2 text-sm font-extrabold hover:bg-[#201e1d]/7 active:bg-[#201e1d]/14"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="cursor-pointer bg-hud-accent px-3.5 py-2 text-sm font-extrabold text-[#f3f2f2] hover:bg-[#dd2b0f] active:bg-hud-accent-deep"
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>,
    document.body,
  );
};

export default ConfirmDialog;
