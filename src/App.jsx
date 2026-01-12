import Header from "./components/header/header";
import TaskList from "./components/task-list/task-list";
import { useEffect, useState } from "react";
import {
  DndContext,
  DragOverlay,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import TaskCard from "./components/task_card/task_card";
import { hoverSound } from "./utils/hover-sound";
import { hoverSound2 } from "./utils/hover-sound-2";
import "./App.css";

function App() {
  const [activeTask, setActiveTask] = useState(null);
  const [tasks, setTasks] = useState(() => {
    const storedTasks = localStorage.getItem("tasks");
    return storedTasks ? JSON.parse(storedTasks) : [];
  });

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5,
      },
    })
  );

  const taskLists = [
    { id: "pending", status: "pending" },
    { id: "completed", status: "completed" },
    { id: "canceled", status: "canceled" },
  ];

  // Call once (e.g. App.jsx)
  useEffect(() => {
    const unlock = () => {
      hoverSound.play().then(() => {
        hoverSound.pause();
        hoverSound.currentTime = 0;
      });
      window.removeEventListener("click", unlock);
    };

    window.addEventListener("click", unlock);

    const unlock2 = () => {
      hoverSound2.play().then(() => {
        hoverSound2.pause();
        hoverSound2.currentTime = 0;
      });
      window.removeEventListener("click", unlock2);
    };

    window.addEventListener("click", unlock2);

    window.addEventListener("click", unlock);
    window.addEventListener("keydown", unlock);

    return () => {
      window.removeEventListener("click", unlock);
      window.removeEventListener("keydown", unlock);
    };
  }, []);

  const handleDragStart = (event) => {
    setActiveTask(tasks.find((task) => task.id === event.active.id));
  };

  const handleDragEnd = (event) => {
    const { active, over } = event;

    if (!over) return;

    const taskId = active.id;
    const newStatus = over.id;

    setTasks((prevTasks) => {
      const newList = prevTasks.map((task) =>
        task.id === taskId ? { ...task, status: newStatus } : task
      );

      localStorage.setItem("tasks", JSON.stringify(newList));
      return newList;
    });
  };

  return (
    <div className="app-background">
      <Header />
      <div className="task-list--container">
        <DndContext
          sensors={sensors}
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
        >
          <DragOverlay>
            {activeTask ? (
              <TaskCard task={activeTask} taskNumber={activeTask.number} />
            ) : null}
          </DragOverlay>
          {taskLists.map(({ id, status }) => (
            <TaskList
              key={id}
              tasks={tasks.filter((task) => task.status === status)}
              status={status}
              setTasks={setTasks}
            />
          ))}
        </DndContext>
      </div>
    </div>
  );
}

export default App;
