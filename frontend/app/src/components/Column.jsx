import TaskCard from "./TaskCard";

export default function Column({
  status,
  tasks,
  onDrop,
  onDragOver,
  onUpdate,
  onDelete,
  loading,
}) {
  return (
    <div
      className={`kanban-column ${status.toLowerCase()}`}
      onDrop={(event) => onDrop(event, status)}
      onDragOver={onDragOver}
    >
      <div className="kanban-column-header">
        <div>
          <h2>{formatStatus(status)}</h2>
          <p>{getColumnDescription(status)}</p>
        </div>

        <span>{tasks.length}</span>
      </div>

      <div className="kanban-column-content">
        {tasks.length === 0 ? (
          <p className="empty-column">Drop tasks here</p>
        ) : (
          tasks.map((task) => (
            <TaskCard
              key={task.taskId}
              task={task}
              onUpdate={onUpdate}
              onDelete={onDelete}
              loading={loading}
            />
          ))
        )}
      </div>
    </div>
  );
}

function formatStatus(status) {
  return status.replace("_", " ");
}

function getColumnDescription(status) {
  if (status === "OPEN") return "New and planned tasks";
  if (status === "IN_PROGRESS") return "Currently being worked on";
  if (status === "DONE") return "Completed tasks";
  return "";
}