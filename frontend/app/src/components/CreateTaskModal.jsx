import TaskForm from "./TaskForm";

export default function CreateTaskModal({
  isOpen,
  onClose,
  onCreate,
  loading,
  currentUser,
}) {
  if (!isOpen) return null;

  return (
    <div className="modal-backdrop" role="presentation" onClick={onClose}>
      <div
        className="create-task-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="create-task-title"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="create-task-modal-header">
          <div>
            <h2 id="create-task-title">Create Task</h2>
            <p>Add a new task to your board.</p>
          </div>

          <button className="modal-close-button" type="button" onClick={onClose}>
            ×
          </button>
        </div>

        <TaskForm
          onCreate={onCreate}
          loading={loading}
          currentUser={currentUser}
          onSuccess={onClose}
          compact
        />
      </div>
    </div>
  );
}