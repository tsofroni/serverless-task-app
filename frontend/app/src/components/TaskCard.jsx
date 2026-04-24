export default function TaskCard({ task }) {
  function handleDragStart(event) {
    event.dataTransfer.setData("taskId", task.taskId);
    event.dataTransfer.setData("currentStatus", task.status);
  }

  return (
    <article className="kanban-card" draggable onDragStart={handleDragStart}>
      <div className="kanban-card-header">
        <h3>{task.title}</h3>
        <span className={`task-status ${task.status.toLowerCase()}`}>
          {task.status}
        </span>
      </div>

      <p>{task.description || "No description provided."}</p>

      <div className="kanban-card-meta">
        <small>Created: {task.createdAt}</small>
        <small>Updated: {task.updatedAt}</small>
      </div>
    </article>
  );
}