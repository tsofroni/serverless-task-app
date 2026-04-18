import { useState } from "react";

export default function TaskItem({ task, onDelete, onStatusChange, loading }) {
    const [updating, setUpdating] = useState(false);

    async function handleStatusChange(event) {
        const newStatus = event.target.value;
        setUpdating(true);

        try {
            await onStatusChange(task.taskId, {
                title: task.title,
                description: task.description,
                status: newStatus,
            });
        } finally {
            setUpdating(false);
        }
    }

    async function handleDelete() {
        await onDelete(task.taskId);
    }

    return (
        <div className = "task-item">
            <div className = "task-item-header">
                <h3>{task.title}</h3>
                <span className = {`task-status ${task.status.toLowerCase()}`}>
                    {task.status}
                </span>
            </div>

            <p>{task.description || "No description provided."}</p>

            <div className = "task-meta">
                <small>Task ID: {task.taskId}</small>
                <small>Created: {task.createdAt}</small>
                <small>Updated: {task.updatedAt}</small>
            </div>

            <div className = "task-actions">
                <select
                    value = {task.status}
                    onChange = {handleStatusChange}
                    disabled = {loading || updating}
                >
                    <option value = "OPEN">OPEN</option>
                    <option value = "IN_PROGRESS">IN_PROGRESS</option>
                    <option value = "DONE">DONE</option>
                </select>

                <button
                    className = "button danger"
                    onClick = {handleDelete}
                    disabled = {loading}
                >
                    Delete
                </button>
            </div>
        </div>
    );
}