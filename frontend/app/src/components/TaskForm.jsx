import { useEffect, useState } from "react";

export default function TaskForm({ onCreate, loading, currentUser }) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState("OPEN");
  const [assignee, setAssignee] = useState("");
  const [reporter, setReporter] = useState(
    currentUser?.displayName || "Authenticated user"
  );
  const [priority, setPriority] = useState("MEDIUM");
  const [dueDate, setDueDate] = useState("");

  useEffect(() => {
    setReporter(currentUser?.displayName || "Authenticated user");
  }, [currentUser]);

  async function handleSubmit(event) {
    event.preventDefault();

    await onCreate({
      title,
      description,
      status,
      assignee,
      reporter,
      priority,
      dueDate,
    });

    setTitle("");
    setDescription("");
    setStatus("OPEN");
    setAssignee("");
    setReporter(currentUser?.displayName || "Authenticated user");
    setPriority("MEDIUM");
    setDueDate("");
  }

  return (
    <form className="task-form" onSubmit={handleSubmit}>
      <h2>Create Task</h2>

      <label>
        Title
        <input
          type="text"
          value={title}
          onChange={(event) => setTitle(event.target.value)}
          placeholder="Enter task title"
          required
        />
      </label>

      <label>
        Description
        <textarea
          value={description}
          onChange={(event) => setDescription(event.target.value)}
          placeholder="Enter task description"
        />
      </label>

      <label>
        Assignee
        <input
          type="text"
          value={assignee}
          onChange={(event) => setAssignee(event.target.value)}
          placeholder="Assign to..."
        />
      </label>

      <label>
        Reporter
        <input type="text" value={reporter} readOnly />
      </label>

      <label>
        Priority
        <select
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
          type="date"
          value={dueDate}
          onChange={(event) => setDueDate(event.target.value)}
        />
      </label>

      <label>
        Status
        <select
          value={status}
          onChange={(event) => setStatus(event.target.value)}
        >
          <option value="OPEN">OPEN</option>
          <option value="IN_PROGRESS">IN_PROGRESS</option>
          <option value="DONE">DONE</option>
        </select>
      </label>

      <button className="button primary" type="submit" disabled={loading}>
        {loading ? "Creating..." : "Create Task"}
      </button>
    </form>
  );
}