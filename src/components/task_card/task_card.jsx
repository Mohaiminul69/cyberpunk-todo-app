import "./task-card.css";

const TaskCard = ({ text, taskNumber }) => {
  return (
    <div className="card--wrapper clipped-card card-shadow">
      <div className="card--border card-shadow clipped-card">
        <div className="pad text-shadow--glow card">
          # {taskNumber} {text}
        </div>
      </div>
    </div>
  );
};

export default TaskCard;
