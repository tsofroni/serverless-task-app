import { useState } from "react";
import ConfirmModal from "./ConfirmModal";
import TaskDetailModal from "./TaskDetailModal";

export default function TaskCard({ task, onUpdate, onDelete, loading }) {
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [formState, setFormState] = useState(getInitialFormState(task));

  const isOverdue =
    task.dueDate && new Date(task.dueDate) < startOfToday() && task.status !== "DONE";

  function handleDragStart(event) {
    event.dataTransfer.setData("taskId", task.taskId);
    event.dataTransfer.setData("currentStatus", task.status);
  }

  function openDetails() {
    setFormState(getInitialFormState(task));
    setShowDetailModal(true);
  }

  function updateFormField(field, value) {
    setFormState((current) => ({
      ...current,
      [field]: value,
    }));
  }

  async function handleSave() {
    await onUpdate(task.taskId, {
      title: formState.title,
      description: formState.description,
      status: formState.status,
      assignee: formState.assignee,
      reporter: formState.reporter,
      priority: formState.priority,
      dueDate: formState.dueDate,
      labels: parseLabels(formState.labelsText),
    });

    setShowDetailModal(false);
  }

  async function handleDelete() {
    await onDelete(task.taskId);
    setShowDeleteModal(false);
    setShowDetailModal(false);
  }

  return (
    <>
      <article
        className={`kanban-card ${isOverdue ? "overdue-card" : ""}`}
        draggable
        onDragStart={handleDragStart}
        onClick={openDetails}
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

          {task.dueDate && (
            <span className={`due-date-badge ${isOverdue ? "overdue" : ""}`}>
              Due {task.dueDate}
            </span>
          )}
        </div>

        {task.labels?.length > 0 && (
          <div className="label-list">
            {task.labels.map((label) => (
              <span className="task-label" key={label}>
                {label}
              </span>
            ))}
          </div>
        )}

        <div className="jira-meta">
          <span>👤 Assignee: {task.assignee || "Unassigned"}</span>
          <span>📝 Reporter: {task.reporter || "Unknown"}</span>
        </div>

        <div className="kanban-card-meta">
          <small>Updated: {formatDate(task.updatedAt)}</small>
        </div>
      </article>

      <TaskDetailModal
        isOpen={showDetailModal}
        task={task}
        formState={formState}
        onChange={updateFormField}
        onSave={handleSave}
        onClose={() => setShowDetailModal(false)}
        onDelete={() => setShowDeleteModal(true)}
        loading={loading}
      />

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

function getInitialFormState(task) {
  return {
    title: task.title || "",
    description: task.description || "",
    status: task.status || "OPEN",
    assignee: task.assignee || "",
    reporter: task.reporter || "Authenticated user",
    priority: task.priority || "MEDIUM",
    dueDate: task.dueDate || "",
    labelsText: Array.isArray(task.labels) ? task.labels.join(", ") : "",
  };
}

function parseLabels(value) {
  return value
    .split(",")
    .map((label) => label.trim())
    .filter(Boolean);
}

function formatDate(value) {
  if (!value) return "N/A";
  return new Date(value).toLocaleString();
}

function normalizePriority(priority) {
  return (priority || "MEDIUM").toLowerCase();
}

function startOfToday() {
  const date = new Date();
  date.setHours(0, 0, 0, 0);
  return date;
}