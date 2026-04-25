export default function ToastContainer({ toasts, onRemove }) {
  if (!toasts.length) return null;

  return (
    <div className="toast-container">
      {toasts.map((toast) => (
        <div key={toast.id} className={`toast toast-${toast.type}`}>
          <div className="toast-icon">{toast.type === "success" ? "✓" : "!"}</div>

          <div className="toast-content">
            <strong>{toast.title}</strong>
            {toast.message && <p>{toast.message}</p>}
          </div>

          <button
            className="toast-close"
            type="button"
            onClick={() => onRemove(toast.id)}
            aria-label="Close notification"
          >
            ×
          </button>
        </div>
      ))}
    </div>
  );
}