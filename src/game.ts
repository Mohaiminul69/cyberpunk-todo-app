// Game layer from the Quest Board design: XP, levels, streak and the daily quest.
import type { Rarity } from "./types";

export const RARITIES: Record<
  Rarity,
  { label: string; color: string; pips: number; xp: number }
> = {
  common: { label: "COMMON", color: "#bab6b6", pips: 1, xp: 10 },
  rare: { label: "RARE", color: "oklch(0.75 0.13 240)", pips: 2, xp: 25 },
  epic: { label: "EPIC", color: "oklch(0.72 0.17 310)", pips: 3, xp: 60 },
  legendary: { label: "LEGENDARY", color: "oklch(0.82 0.15 85)", pips: 4, xp: 150 },
};

export const RARITY_ORDER: Rarity[] = ["common", "rare", "epic", "legendary"];

/** Preset swatches in the column color picker */
export const COLUMN_COLOR_PRESETS = [
  { name: "AMBER", value: "oklch(0.82 0.15 85)" },
  { name: "CYAN", value: "oklch(0.8 0.12 200)" },
  { name: "RED", value: "#ff563c" },
  { name: "GREEN", value: "oklch(0.8 0.17 150)" },
  { name: "BLUE", value: "oklch(0.76 0.13 260)" },
  { name: "VIOLET", value: "oklch(0.74 0.16 310)" },
  { name: "PINK", value: "oklch(0.78 0.15 355)" },
  { name: "STEEL", value: "#bab6b6" },
];

/** New columns cycle through the presets (Steel last, as it reads as neutral) */
export const COLUMN_COLORS = COLUMN_COLOR_PRESETS.map((preset) => preset.value);

export const DAILY_GOAL = 3;
export const DAILY_BONUS_XP = 100;

// The design shows 40; replace with the achievement list's length once it exists
export const ACHIEVEMENT_COUNT = 40;

export type GameState = {
  totalXp: number;
  /** XP from the most recent completion, shown as a light sliver on the XP bar */
  lastGain: number;
  streak: number;
  lastCompletionDay: string | null;
  daily: { day: string; completed: number };
};

export const INITIAL_GAME: GameState = {
  totalXp: 0,
  lastGain: 0,
  streak: 0,
  lastCompletionDay: null,
  daily: { day: "", completed: 0 },
};

/** XP needed to go from `level` to `level + 1` */
export const xpToNextLevel = (level: number) => 250 * level;

export const getLevelInfo = (totalXp: number) => {
  let level = 1;
  let remaining = totalXp;
  while (remaining >= xpToNextLevel(level)) {
    remaining -= xpToNextLevel(level);
    level++;
  }
  return { level, xpIntoLevel: remaining, xpNeeded: xpToNextLevel(level) };
};

/** Local calendar day, e.g. "2026-10-07" */
export const dayKey = (date: Date | number = new Date()) => {
  const d = new Date(date);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
};

const yesterdayKey = () => {
  const d = new Date();
  d.setDate(d.getDate() - 1);
  return dayKey(d);
};

/** The streak only counts while the last completion was today or yesterday */
export const getCurrentStreak = (game: GameState) =>
  game.lastCompletionDay === dayKey() || game.lastCompletionDay === yesterdayKey()
    ? game.streak
    : 0;

export const getDailyCompleted = (game: GameState) =>
  game.daily.day === dayKey() ? game.daily.completed : 0;

export const completeTask = (game: GameState, xp: number): GameState => {
  const today = dayKey();
  const completed = getDailyCompleted(game) + 1;
  const gain = xp + (completed === DAILY_GOAL ? DAILY_BONUS_XP : 0);

  let streak = 1;
  if (game.lastCompletionDay === today) streak = game.streak;
  else if (game.lastCompletionDay === yesterdayKey()) streak = game.streak + 1;

  return {
    totalXp: game.totalXp + gain,
    lastGain: gain,
    streak,
    lastCompletionDay: today,
    daily: { day: today, completed },
  };
};

/** Unchecking takes the XP back, and the daily bonus if it drops below the goal */
export const uncompleteTask = (
  game: GameState,
  xp: number,
  completedAt?: number,
): GameState => {
  const today = dayKey();
  const countedToday =
    completedAt !== undefined &&
    dayKey(completedAt) === today &&
    getDailyCompleted(game) > 0;
  const completed = getDailyCompleted(game) - (countedToday ? 1 : 0);
  const lostBonus =
    countedToday && completed === DAILY_GOAL - 1 ? DAILY_BONUS_XP : 0;

  return {
    ...game,
    totalXp: Math.max(0, game.totalXp - xp - lostBonus),
    lastGain: 0,
    daily: { day: today, completed },
  };
};
