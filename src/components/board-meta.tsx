import { DAILY_BONUS_XP, DAILY_GOAL } from "../game";
import LockIcon from "../icons/lock-icon";

interface Props {
  columnCount: number;
  taskCount: number;
  dailyCompleted: number;
}

const BoardMeta = ({ columnCount, taskCount, dailyCompleted }: Props) => {
  const dailyDone = Math.min(dailyCompleted, DAILY_GOAL);

  return (
    <div className="flex flex-wrap items-center gap-x-6 gap-y-3 py-4">
      <div className="text-[11px] font-bold tracking-[.16em] text-hud-muted">
        BOARD <span className="text-hud-idle">//</span> {columnCount}{" "}
        {columnCount === 1 ? "COLUMN" : "COLUMNS"} · {taskCount}{" "}
        {taskCount === 1 ? "QUEST" : "QUESTS"}
      </div>

      {/* Daily quest */}
      <div className="flex items-center gap-2.5 border border-hud-line-strong px-3 py-1.5">
        <span className="text-[10px] font-bold tracking-[.14em] text-hud-amber">
          DAILY
        </span>
        <span className="text-xs text-hud-ink-3">Clear {DAILY_GOAL} quests</span>
        <div className="flex gap-0.5">
          {Array.from({ length: DAILY_GOAL }, (_, i) => (
            <div
              key={i}
              className={`h-1.5 w-4 transition-colors ${i < dailyDone ? "bg-hud-amber" : "bg-hud-line"}`}
            />
          ))}
        </div>
        <span className="text-[11px] text-hud-muted tabular-nums">
          {dailyDone}/{DAILY_GOAL} · +{DAILY_BONUS_XP} XP
        </span>
      </div>

      {/* Recent achievements: none exist yet, so every slot is locked */}
      <div className="ml-auto flex items-center gap-2">
        <span className="mr-1 text-[10px] font-bold tracking-[.14em] text-hud-muted-2">
          RECENT
        </span>
        {Array.from({ length: 4 }, (_, i) => (
          <div
            key={i}
            title="Locked"
            className="grid size-7.5 place-items-center border border-dashed border-hud-idle text-hud-idle"
          >
            <LockIcon />
          </div>
        ))}
      </div>
    </div>
  );
};

export default BoardMeta;
