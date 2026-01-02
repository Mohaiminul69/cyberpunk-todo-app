import TaskCard from "../task_card/task_card";
import "./task-list.css";

const TaskList = ({ listTitle }) => {
  const todoItems = [
    "I have to make a todo list",
    "Make the UI better and consistent with cyberpunk design or style",
    "Add a delete button to each task card",
    "Add a delete button to each task card",
    "Add a delete button to each task card",
    "Add a delete button to each task card",
    "Add a delete button to each task card",
    "Add a delete button to each task card",
    "Add a delete button to each task card",
    "Add a delete button to each task card",
  ];

  return (
    <>
      <div className="list-wrapper">
        <div className="list-title-wrapper">
          <p className="list-title">{listTitle}</p>
        </div>

        <div className="list-container">
          {todoItems.map((item, index) => (
            <TaskCard taskNumber={index + 1} key={index} text={item} />
          ))}
        </div>
      </div>
    </>
  );
};

export default TaskList;
