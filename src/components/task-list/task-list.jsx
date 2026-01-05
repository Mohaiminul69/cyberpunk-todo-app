import { useDroppable } from "@dnd-kit/core";
import TaskCard from "../task_card/task_card";
import "./task-list.css";

const handleKeyDown = (setTasks) => (event) => {
  if (event.key === "Enter") {
    const newTask = {
      id: crypto.randomUUID(),
      status: "pending",
      task: event.target.value,
    };

    setTasks((prevTasks) => {
      const newList = [...prevTasks, newTask];
      localStorage.setItem("tasks", JSON.stringify(newList));
      return newList;
    });

    event.target.value = "";
  }
};

const TaskList = ({ tasks, status, setTasks }) => {
  const { setNodeRef } = useDroppable({ id: status });
  const isPending = status === "pending";
  const listTitle =
    status === "pending"
      ? "My Tasks"
      : status === "completed"
      ? "Done"
      : "Canceled";

  return (
    <>
      <div className={`list-wrapper wrapper-type--${status}`}>
        <div className="list-title-wrapper">
          <p className="list-title">{listTitle}</p>
        </div>
        <div ref={setNodeRef} className="list-container">
          {isPending && (
            <input onKeyDown={handleKeyDown(setTasks)} type="text" />
          )}
          {tasks.map((task, index) => (
            <TaskCard taskNumber={index + 1} key={task.id} task={task} />
          ))}
        </div>
      </div>
    </>
  );
};

export default TaskList;
