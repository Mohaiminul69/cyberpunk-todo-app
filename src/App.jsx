import Header from "./components/header/header";
import TaskList from "./components/task-list/task-list";
import "./App.css";

function App() {
  return (
    <div className="app-background">
      <Header />
      <div className="task-list--container">
        <TaskList status="pending" listTitle="My Tasks" />
        <TaskList status="completed" listTitle="Done" />
        <TaskList status="canceled" listTitle="Canceled" />
      </div>
    </div>
  );
}

export default App;
