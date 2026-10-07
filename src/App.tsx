import { useEffect, useState } from "react";
import Header from "./components/header";
import KanbanBoard from "./components/kanban-board";
import {
  INITIAL_GAME,
  completeTask,
  getDailyCompleted,
  getLevelInfo,
  uncompleteTask,
} from "./game";
import "./App.css";

function App() {
  const [game, setGame] = useState(INITIAL_GAME);
  const [levelUpTo, setLevelUpTo] = useState<number | null>(null);

  useEffect(() => {
    if (levelUpTo === null) return;
    const timeout = setTimeout(() => setLevelUpTo(null), 1500);
    return () => clearTimeout(timeout);
  }, [levelUpTo]);

  const handleTaskCompleted = (xp: number) => {
    const next = completeTask(game, xp);
    const nextLevel = getLevelInfo(next.totalXp).level;
    if (nextLevel > getLevelInfo(game.totalXp).level) setLevelUpTo(nextLevel);
    setGame(next);
  };

  const handleTaskUncompleted = (xp: number, completedAt?: number) => {
    setGame(uncompleteTask(game, xp, completedAt));
  };

  return (
    <div className="app-background flex h-screen flex-col overflow-hidden px-10 font-archivo">
      <Header game={game} />
      <KanbanBoard
        dailyCompleted={getDailyCompleted(game)}
        onTaskCompleted={handleTaskCompleted}
        onTaskUncompleted={handleTaskUncompleted}
      />

      {levelUpTo !== null && (
        <div
          key={levelUpTo}
          role="status"
          className="level-up-banner pointer-events-none fixed inset-x-0 top-1/3 z-40 bg-hud-accent py-6 text-center text-5xl leading-none font-black font-stretch-125% italic shadow-[0_0_40px_rgba(236,48,19,.55)]"
        >
          LEVEL {levelUpTo}
        </div>
      )}
    </div>
  );
}

export default App;
