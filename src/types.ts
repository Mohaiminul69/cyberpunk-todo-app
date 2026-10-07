export type Id = string | number;

export type Rarity = "common" | "rare" | "epic" | "legendary";

export type Column = {
  id: Id;
  title: string;
  /** CSS color for the column's top border, count box, numbers and progress */
  color: string;
};

export type Task = {
  id: Id;
  columnId: Id;
  content: string;
  rarity: Rarity;
  done: boolean;
  /** Timestamp of the completion, used to undo the daily quest when unchecked */
  completedAt?: number;
};
