export default function ConfirmModal({
  isOpen,
  title,
  message,
  confirmText = "Confirm",
  cancelText = "Cancel",
  variant = "danger",
  onConfirm,
  onCancel,
  loading = false,
}) {
  if (!isOpen) return null;

  return (
    <div className="modal-backdrop" role="presentation" onClick={onCancel}>
      <div
        className="modal-card"
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
        onClick={(event) => event.stopPropagation()}
      >
        <div className={`modal-icon ${variant}`}>
          {variant === "danger" ? "!" : "?"}
        </div>

        <h2 id="modal-title">{title}</h2>
        <p>{message}</p>

        <div className="modal-actions">
          <button
            className="button secondary"
            type="button"
            onClick={onCancel}
            disabled={loading}
          >
            {cancelText}
          </button>

          <button
            className={`button ${variant}`}
            type="button"
            onClick={onConfirm}
            disabled={loading}
          >
            {loading ? "Working..." : confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}