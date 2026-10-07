import FlameIcon from "../icons/flame-icon";
import TrophyIcon from "../icons/trophy-icon";
import {
  ACHIEVEMENT_COUNT,
  getCurrentStreak,
  getLevelInfo,
  type GameState,
} from "../game";

const DAY_MS = 1000 * 60 * 60 * 24;

const getYearProgress = () => {
  const now = new Date();
  const yearStart = new Date(now.getFullYear(), 0, 1).getTime();
  const nextYearStart = new Date(now.getFullYear() + 1, 0, 1).getTime();
  const daysLeft = Math.ceil(
    (new Date(now.getFullYear(), 11, 31).getTime() - now.getTime()) / DAY_MS,
  );
  const elapsed = (now.getTime() - yearStart) / (nextYearStart - yearStart);
  return { daysLeft, elapsed };
};

const formatNumber = (value: number) => value.toLocaleString("en-US");

const hudLabel = "text-[10px] font-bold tracking-[.14em] text-hud-muted";

interface Props {
  game: GameState;
}

const Header = ({ game }: Props) => {
  const { daysLeft, elapsed } = getYearProgress();
  const { level, xpIntoLevel, xpNeeded } = getLevelInfo(game.totalXp);
  const player = {
    level,
    xp: xpIntoLevel,
    streak: getCurrentStreak(game),
    // No achievement system yet
    achievementsUnlocked: 0,
  };
  const xpPercent = Math.min(player.xp / xpNeeded, 1) * 100;
  const gainPercent = Math.min(game.lastGain / xpNeeded, xpPercent / 100) * 100;

  return (
    <>
      {/* Mobile header: logo row, 3-cell stats strip */}
      <header className="shrink-0 md:hidden">
        <div className="flex items-center gap-2.5 pt-4 pb-3.5">
          <div className="h-6.5 w-2.5 -skew-x-14 bg-hud-accent" />
          <div className="text-[26px] leading-none font-black font-stretch-125% italic">
            TODO
          </div>
          <div className="ml-auto text-right text-[10px] leading-[1.3] font-bold tracking-[.12em] text-hud-accent-on-dark">
            {daysLeft} DAYS LEFT
            <br />
            OF THIS YEAR
          </div>
        </div>
        <div className="grid grid-cols-[1fr_auto_auto] gap-0.5">
          <div className="flex items-center gap-2.5 bg-hud-panel-raised px-3 py-2.5">
            <span
              aria-label={`Level ${player.level}`}
              className="text-[22px] leading-none font-black font-stretch-125% tabular-nums"
            >
              {player.level}
            </span>
            <div className="flex flex-1 flex-col gap-1.25">
              <span className="text-[10px] font-semibold tracking-[.08em] text-hud-muted tabular-nums">
                {formatNumber(player.xp)} / {formatNumber(xpNeeded)} XP
              </span>
              <div className="relative h-1.5 bg-hud-line">
                <div
                  className="absolute inset-y-0 left-0 bg-hud-accent transition-[width] duration-600 ease-[cubic-bezier(.2,.8,.2,1)]"
                  style={{ width: `${xpPercent}%` }}
                />
              </div>
            </div>
          </div>
          <div
            aria-label={`${player.streak} day streak`}
            className="flex items-center gap-1.5 bg-hud-panel-raised px-3 py-2.5"
          >
            <span className="text-hud-amber">
              <FlameIcon size={16} />
            </span>
            <span className="text-base font-black tabular-nums">{player.streak}</span>
          </div>
          <div
            aria-label={`${player.achievementsUnlocked} of ${ACHIEVEMENT_COUNT} achievements`}
            className="flex items-center gap-1.5 bg-hud-panel-raised px-3 py-2.5"
          >
            <TrophyIcon size={16} />
            <span className="text-base font-black tabular-nums">
              {player.achievementsUnlocked}
            </span>
          </div>
        </div>
        <div className="mt-3.5 h-0.5 bg-hud-accent shadow-[0_0_14px_rgba(236,48,19,.55)]" />
      </header>

      <header className="hidden flex-wrap items-center gap-x-10 gap-y-4 py-5.5 md:flex">
        {/* Logo */}
        <div className="flex items-center gap-3">
          <div className="h-8.5 w-3.5 -skew-x-14 bg-hud-accent" />
          <div className="text-[34px] leading-none font-black font-stretch-125% tracking-[-0.02em] italic">
            TODO
          </div>
        </div>

        {/* Year counter */}
        <div className="flex min-w-55 flex-col gap-1.5">
          <div className="text-xs font-bold tracking-[.14em] text-hud-accent-on-dark uppercase">
            {daysLeft} days left of this year
          </div>
          <div className="flex gap-0.5">
            <div className="h-1 bg-hud-accent-on-dark" style={{ flex: elapsed }} />
            <div className="h-1 bg-hud-line" style={{ flex: 1 - elapsed }} />
          </div>
        </div>

        {/* Player stats */}
        <div className="ml-auto flex items-stretch gap-0.5">
          <div className="flex items-center gap-3.5 bg-hud-panel-raised px-4.5 py-2.5">
            <div className="flex flex-col items-start leading-none">
              <span className={hudLabel}>LEVEL</span>
              <span className="text-[30px] font-black font-stretch-125% tabular-nums">
                {player.level}
              </span>
            </div>
            <div className="flex w-55 flex-col gap-1.75">
              <div className="flex justify-between text-[11px] font-semibold tracking-[.08em] text-hud-ink-3">
                <span>XP</span>
                <span className="tabular-nums">
                  {formatNumber(player.xp)} / {formatNumber(xpNeeded)}
                </span>
              </div>
              <div className="relative h-2 bg-hud-line">
                <div
                  className="absolute inset-y-0 left-0 bg-hud-accent transition-[width] duration-600 ease-[cubic-bezier(.2,.8,.2,1)]"
                  style={{ width: `${xpPercent}%` }}
                />
                {/* Light sliver at the fill edge marks the most recent gain */}
                {gainPercent > 0 && (
                  <div
                    className="absolute inset-y-0 bg-hud-accent-light transition-[left,width] duration-600 ease-[cubic-bezier(.2,.8,.2,1)]"
                    style={{
                      left: `${xpPercent - gainPercent}%`,
                      width: `${gainPercent}%`,
                    }}
                  />
                )}
              </div>
              <div className="text-[10px] tracking-[.08em] text-hud-muted-2">
                {formatNumber(xpNeeded - player.xp)} XP TO LEVEL {player.level + 1}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2.5 bg-hud-panel-raised px-4.5 py-2.5">
            <span className="text-hud-amber">
              <FlameIcon />
            </span>
            <div className="flex flex-col leading-[1.1]">
              <span className="text-[22px] font-black font-stretch-125% tabular-nums">
                {player.streak}
              </span>
              <span className={hudLabel}>DAY STREAK</span>
            </div>
          </div>

          <div className="flex items-center gap-2.5 bg-hud-panel-raised px-4.5 py-2.5">
            <span className="text-hud-ink">
              <TrophyIcon />
            </span>
            <div className="flex flex-col leading-[1.1]">
              <span className="text-[22px] font-black font-stretch-125% tabular-nums">
                {player.achievementsUnlocked}
                <span className="text-[13px] text-hud-muted-2">/{ACHIEVEMENT_COUNT}</span>
              </span>
              <span className={hudLabel}>ACHIEVEMENTS</span>
            </div>
          </div>
        </div>
      </header>

      {/* Header rule */}
      <div className="hidden h-0.5 shrink-0 bg-hud-accent md:block shadow-[0_0_18px_rgba(236,48,19,.55)]" />
    </>
  );
};

export default Header;
