import Column from "./Column";

const STATUSES = ["OPEN", "IN_PROGRESS", "DONE"];

export default function KanbanBoard({ tasks, onUpdate, onDelete, loading }) {
  const columns = {
    OPEN: tasks.filter((task) => task.status === "OPEN"),
    IN_PROGRESS: tasks.filter((task) => task.status === "IN_PROGRESS"),
    DONE: tasks.filter((task) => task.status === "DONE"),
  };

  function handleDrop(event, newStatus) {
    event.preventDefault();

    const taskId = event.dataTransfer.getData("taskId");
    const currentStatus = event.dataTransfer.getData("currentStatus");

    if (!taskId || currentStatus === newStatus) return;

    const task = tasks.find((item) => item.taskId === taskId);
    if (!task) return;

    onUpdate(taskId, {
      title: task.title,
      description: task.description,
      status: newStatus,
      assignee: task.assignee || "",
      reporter: task.reporter || "Authenticated user",
      priority: task.priority || "MEDIUM",
      dueDate: task.dueDate || "",
      labels: task.labels || [],
    });
  }

  function allowDrop(event) {
    event.preventDefault();
  }

  return (
    <section className="kanban-board">
      {STATUSES.map((status) => (
        <Column
          key={status}
          status={status}
          tasks={columns[status]}
          onDrop={handleDrop}
          onDragOver={allowDrop}
          onUpdate={onUpdate}
          onDelete={onDelete}
          loading={loading}
        />
      ))}
    </section>
  );
}