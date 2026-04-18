import TaskItem from "./TaskItem";

export default function TaskList({ tasks, onDelete, onStatusChange, loading}) {
    if (!tasks.length) {
        return (
            <section className = "task-list">
                <h2>Your Tasks</h2>
                <p>No tasks found yet.</p>
            </section>
        );
    }

    return (
        <section className = "task-list">
            <h2>Your Tasks</h2>

            <div className = "task-list-grid">
                {tasks.map((task) => (
                    <TaskItem
                        key = {task.taskId}
                        task = {task}
                        onDelete = {onDelete}
                        onStatusChange = {onStatusChange}
                        loading = {loading}
                    />
                ))}
            </div>
        </section>
    );
}