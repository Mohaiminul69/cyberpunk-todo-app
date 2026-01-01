import "./App.css";
import TaskCard from "./components/task_card/task_card";

function App() {
  const todoItems = [
    "I have to make a todo list",
    "Make the UI better and consistent with cyberpunk design or style",
    "Add a delete button to each task card",
  ];

  return (
    <div className="h-screen bg-black p-10">
      <div className="size-full grid grid-cols-3">
        <div className="h-full p-2 space-y-4">
          {todoItems.map((item, index) => (
            <TaskCard taskNumber={index + 1} key={index} text={item} />
          ))}
        </div>
        <div className="h-full p-2">
          <TaskCard taskNumber={1} text="I have to make a todo list" />
        </div>
        <div className="h-full p-2">
          <TaskCard
            taskNumber={1}
            text="Make the UI better and consistent with cyberpunk design or style"
          />
        </div>
      </div>
    </div>
  );
}

export default App;
