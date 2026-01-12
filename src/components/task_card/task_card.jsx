import { useDraggable } from "@dnd-kit/core";
import { playHoverSound } from "../../utils/hover-sound";
import "./task-card.css";

const TaskCard = ({ task, taskNumber, setTasks }) => {
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
    id: task.id,
  });

  const style = {
    opacity: isDragging ? 0 : 1,
  };

  const handleTaskDelete = () => {
    setTasks((prevTasks) => {
      const newList = prevTasks.filter((t) => t.id !== task.id);
      localStorage.setItem("tasks", JSON.stringify(newList));
      return newList;
    });
  };

  return (
    <div
      style={style}
      ref={setNodeRef}
      {...listeners}
      {...attributes}
      onMouseEnter={playHoverSound}
      className={`card--${task.status} card--wrapper clipped-card card-shadow`}
    >
      <div className="card--border card-shadow clipped-card">
        <div className="pad text-shadow--glow card">
          # {taskNumber} {task.task}
          <button onClick={handleTaskDelete} className="task-delete--button">
            X
          </button>
        </div>
      </div>
    </div>
  );
};

export default TaskCard;
