import { useState } from "react";
import ConfirmModal from "./ConfirmModal";

export default function TaskCard({ task, onUpdate, onDelete, loading }) {
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState(task.title);
  const [description, setDescription] = useState(task.description || "");
  const [status, setStatus] = useState(task.status);
  const [assignee, setAssignee] = useState(task.assignee || "");
  const [reporter, setReporter] = useState(
    task.reporter || "Authenticated user"
  );
  const [priority, setPriority] = useState(task.priority || "MEDIUM");
  const [dueDate, setDueDate] = useState(task.dueDate || "");
  const [showDeleteModal, setShowDeleteModal] = useState(false);

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
      assignee,
      reporter,
      priority,
      dueDate,
    });

    setIsEditing(false);
  }

  function handleCancel() {
    setTitle(task.title);
    setDescription(task.description || "");
    setStatus(task.status);
    setAssignee(task.assignee || "");
    setReporter(task.reporter || "Authenticated user");
    setPriority(task.priority || "MEDIUM");
    setDueDate(task.dueDate || "");
    setIsEditing(false);
  }

  async function handleDelete() {
    await onDelete(task.taskId);
    setShowDeleteModal(false);
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
          Assignee
          <input
            className="card-input"
            value={assignee}
            onChange={(event) => setAssignee(event.target.value)}
            placeholder="Assign to..."
          />
        </label>

        <label>
          Reporter
          <input
            className="card-input"
            value={reporter}
            onChange={(event) => setReporter(event.target.value)}
            placeholder="Reporter"
          />
        </label>

        <label>
          Priority
          <select
            className="card-input"
            value={priority}
            onChange={(event) => setPriority(event.target.value)}
          >
            <option value="LOW">LOW</option>
            <option value="MEDIUM">MEDIUM</option>
            <option value="HIGH">HIGH</option>
          </select>
        </label>

        <label>
          Due date
          <input
            className="card-input"
            type="date"
            value={dueDate}
            onChange={(event) => setDueDate(event.target.value)}
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
    <>
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

        <div className="task-badges">
          <span className={`priority-badge ${normalizePriority(task.priority)}`}>
            {task.priority || "MEDIUM"}
          </span>

          {task.dueDate && <span className="due-date-badge">Due {task.dueDate}</span>}
        </div>

        <div className="jira-meta">
          <span>👤 Assignee: {task.assignee || "Unassigned"}</span>
          <span>📝 Reporter: {task.reporter || "Unknown"}</span>
        </div>

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
            onClick={() => setShowDeleteModal(true)}
            disabled={loading}
          >
            Delete
          </button>
        </div>
      </article>

      <ConfirmModal
        isOpen={showDeleteModal}
        title="Delete task?"
        message={`Are you sure you want to delete "${task.title}"? This action cannot be undone.`}
        confirmText="Delete task"
        cancelText="Keep task"
        variant="danger"
        loading={loading}
        onConfirm={handleDelete}
        onCancel={() => setShowDeleteModal(false)}
      />
    </>
  );
}

function formatDate(value) {
  if (!value) return "N/A";

  return new Date(value).toLocaleString();
}

function normalizePriority(priority) {
  return (priority || "MEDIUM").toLowerCase();
}