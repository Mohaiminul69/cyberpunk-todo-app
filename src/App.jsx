import Header from "./components/header/header";
import TaskList from "./components/task-list/task-list";
import { useState } from "react";
import { DndContext, DragOverlay } from "@dnd-kit/core";
import TaskCard from "./components/task_card/task_card";
import "./App.css";

function App() {
  const [activeTask, setActiveTask] = useState(null);
  const [tasks, setTasks] = useState(() => {
    const storedTasks = localStorage.getItem("tasks");
    return storedTasks ? JSON.parse(storedTasks) : [];
  });

  const taskLists = [
    { id: "pending", status: "pending" },
    { id: "completed", status: "completed" },
    { id: "canceled", status: "canceled" },
  ];

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
        <DndContext onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
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
