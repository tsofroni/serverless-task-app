import UserAutocomplete from "./UserAutocomplete";

export default function TaskDetailModal({
  isOpen,
  task,
  formState,
  onChange,
  onSave,
  onClose,
  onDelete,
  loading,
}) {
  if (!isOpen || !task) return null;

  const isOverdue = task.dueDate && new Date(task.dueDate) < startOfToday();

  return (
    <div className="modal-backdrop" role="presentation" onClick={onClose}>
      <div
        className="task-detail-modal"
        role="dialog"
        aria-modal="true"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="task-detail-header">
          <div>
            <span className={`priority-badge ${formState.priority.toLowerCase()}`}>
              {formState.priority}
            </span>

            {formState.dueDate && (
              <span className={`due-date-badge ${isOverdue ? "overdue" : ""}`}>
                Due {formState.dueDate}
              </span>
            )}
          </div>

          <button className="modal-close-button" type="button" onClick={onClose}>
            ×
          </button>
        </div>

        <label>
          Title
          <input
            className="card-input"
            value={formState.title}
            onChange={(event) => onChange("title", event.target.value)}
          />
        </label>

        <label>
          Description
          <textarea
            className="card-textarea large"
            value={formState.description}
            onChange={(event) => onChange("description", event.target.value)}
          />
        </label>

        <div className="task-detail-grid">
          <UserAutocomplete
            label="Assignee"
            value={formState.assignee}
            onChange={(value) => onChange("assignee", value)}
            placeholder="Assign to..."
          />

          <UserAutocomplete
            label="Reporter"
            value={formState.reporter}
            onChange={(value) => onChange("reporter", value)}
            placeholder="Reporter"
          />

          <label>
            Status
            <select
              className="card-input"
              value={formState.status}
              onChange={(event) => onChange("status", event.target.value)}
            >
              <option value="OPEN">OPEN</option>
              <option value="IN_PROGRESS">IN_PROGRESS</option>
              <option value="DONE">DONE</option>
            </select>
          </label>

          <label>
            Priority
            <select
              className="card-input"
              value={formState.priority}
              onChange={(event) => onChange("priority", event.target.value)}
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
              value={formState.dueDate}
              onChange={(event) => onChange("dueDate", event.target.value)}
            />
          </label>

          <label>
            Labels
            <input
              className="card-input"
              value={formState.labelsText}
              onChange={(event) => onChange("labelsText", event.target.value)}
              placeholder="frontend, bug, aws"
            />
          </label>
        </div>

        <div className="task-detail-meta">
          <small>Task ID: {task.taskId}</small>
          <small>Created: {formatDate(task.createdAt)}</small>
          <small>Updated: {formatDate(task.updatedAt)}</small>
        </div>

        <div className="modal-actions">
          <button
            className="button danger"
            type="button"
            onClick={onDelete}
            disabled={loading}
          >
            Delete
          </button>

          <button
            className="button secondary"
            type="button"
            onClick={onClose}
            disabled={loading}
          >
            Cancel
          </button>

          <button
            className="button primary"
            type="button"
            onClick={onSave}
            disabled={loading || !formState.title.trim()}
          >
            {loading ? "Saving..." : "Save changes"}
          </button>
        </div>
      </div>
    </div>
  );
}

function formatDate(value) {
  if (!value) return "N/A";
  return new Date(value).toLocaleString();
}

function startOfToday() {
  const date = new Date();
  date.setHours(0, 0, 0, 0);
  return date;
}