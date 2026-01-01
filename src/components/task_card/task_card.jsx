import React from "react";

const TaskCard = ({ text, taskNumber }) => {
  return (
    <div className="bg-[#0b0b0d] clipped-card p-2 rounded-md">
      <div className="bg-[#e8615a] p-px card-shadow clipped-card rounded-md">
        <div className="pad text-shadow--glow rounded-md p-2 pb-5">
          # {taskNumber} {text}
        </div>
      </div>
    </div>
  );
};

export default TaskCard;
