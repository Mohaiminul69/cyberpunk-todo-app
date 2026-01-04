import { useDraggable } from "@dnd-kit/core";
import "./task-card.css";

const TaskCard = ({ task, taskNumber }) => {
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
    id: task.id,
  });

  const style = {
    opacity: isDragging ? 0 : 1,
  };

  return (
    <div
      style={style}
      ref={setNodeRef}
      {...listeners}
      {...attributes}
      className={`card--${task.status} card--wrapper clipped-card card-shadow`}
    >
      <div className="card--border card-shadow clipped-card">
        <div className="pad text-shadow--glow card">
          # {taskNumber} {task.task}
        </div>
      </div>
    </div>
  );
};

export default TaskCard;
