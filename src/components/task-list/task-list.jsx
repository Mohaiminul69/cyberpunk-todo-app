import { useDroppable } from "@dnd-kit/core";
import TaskCard from "../task_card/task_card";
import TaskInput from "../task-input/task-input";
import "./task-list.css";

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
          {isPending && <TaskInput setTasks={setTasks} />}
          {tasks.map((task, index) => (
            <TaskCard taskNumber={index + 1} key={task.id} task={task} />
          ))}
        </div>
      </div>
    </>
  );
};

export default TaskList;
