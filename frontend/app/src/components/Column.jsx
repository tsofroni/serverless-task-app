import TaskCard from "./TaskCard";

export default function Column({ status, tasks, onDrop, onDragOver }) {
  return (
    <div
      className={`kanban-column ${status.toLowerCase()}`}
      onDrop={(event) => onDrop(event, status)}
      onDragOver={onDragOver}
    >
      <div className="kanban-column-header">
        <h2>{formatStatus(status)}</h2>
        <span>{tasks.length}</span>
      </div>

      <div className="kanban-column-content">
        {tasks.length === 0 ? (
          <p className="empty-column">No tasks</p>
        ) : (
          tasks.map((task) => <TaskCard key={task.taskId} task={task} />)
        )}
      </div>
    </div>
  );
}

function formatStatus(status) {
  return status.replace("_", " ");
}