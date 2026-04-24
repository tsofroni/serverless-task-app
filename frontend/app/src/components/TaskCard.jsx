import { useState } from "react";

export default function TaskCard({ task, onUpdate, onDelete, loading }) {
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState(task.title);
  const [description, setDescription] = useState(task.description || "");
  const [status, setStatus] = useState(task.status);

  function handleDragStart(event) {
    if (isEditing) {
      event.preventDefault();
      return;
    }

    event.dataTransfer.setData("taskId", task.taskId);
    event.dataTransfer.setData("currentStatus", task.status);
  }

  async function handleSave() {
    await onUpdate(task.taskId, {
      title,
      description,
      status,
    });

    setIsEditing(false);
  }

  function handleCancel() {
    setTitle(task.title);
    setDescription(task.description || "");
    setStatus(task.status);
    setIsEditing(false);
  }

  async function handleDelete() {
    const confirmed = window.confirm(
      `Delete task "${task.title}"? This action cannot be undone.`
    );

    if (!confirmed) return;

    await onDelete(task.taskId);
  }

  if (isEditing) {
    return (
      <article className="kanban-card editing">
        <label>
          Title
          <input
            className="card-input"
            value={title}
            onChange={(event) => setTitle(event.target.value)}
          />
        </label>

        <label>
          Description
          <textarea
            className="card-textarea"
            value={description}
            onChange={(event) => setDescription(event.target.value)}
          />
        </label>

        <label>
          Status
          <select
            className="card-input"
            value={status}
            onChange={(event) => setStatus(event.target.value)}
          >
            <option value="OPEN">OPEN</option>
            <option value="IN_PROGRESS">IN_PROGRESS</option>
            <option value="DONE">DONE</option>
          </select>
        </label>

        <div className="card-actions">
          <button
            className="button primary small"
            onClick={handleSave}
            disabled={loading || !title.trim()}
          >
            Save
          </button>

          <button
            className="button secondary small"
            onClick={handleCancel}
            disabled={loading}
          >
            Cancel
          </button>
        </div>
      </article>
    );
  }

  return (
    <article
      className="kanban-card"
      draggable
      onDragStart={handleDragStart}
      onDoubleClick={() => setIsEditing(true)}
    >
      <div className="kanban-card-header">
        <h3>{task.title}</h3>
        <span className={`task-status ${task.status.toLowerCase()}`}>
          {task.status}
        </span>
      </div>

      <p>{task.description || "No description provided."}</p>

      <div className="kanban-card-meta">
        <small>Created: {formatDate(task.createdAt)}</small>
        <small>Updated: {formatDate(task.updatedAt)}</small>
      </div>

      <div className="card-actions">
        <button
          className="button secondary small"
          onClick={() => setIsEditing(true)}
          disabled={loading}
        >
          Edit
        </button>

        <button
          className="button danger small"
          onClick={handleDelete}
          disabled={loading}
        >
          Delete
        </button>
      </div>
    </article>
  );
}

function formatDate(value) {
  if (!value) return "N/A";

  return new Date(value).toLocaleString();
}