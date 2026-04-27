import { useEffect, useState } from "react";
import UserAutocomplete from "./UserAutocomplete";

export default function TaskForm({
  onCreate,
  loading,
  currentUser,
  onSuccess,
  compact = false,
}) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState("OPEN");
  const [assignee, setAssignee] = useState("");
  const [reporter, setReporter] = useState(
    currentUser?.displayName || "Authenticated user"
  );
  const [priority, setPriority] = useState("MEDIUM");
  const [dueDate, setDueDate] = useState("");
  const [labelsText, setLabelsText] = useState("");

  useEffect(() => {
    setReporter(currentUser?.displayName || "Authenticated user");
  }, [currentUser]);

  async function handleSubmit(event) {
    event.preventDefault();

    const created = await onCreate({
      title,
      description,
      status,
      assignee,
      reporter,
      priority,
      dueDate,
      labels: parseLabels(labelsText),
    });

    if (created === false) return;

    setTitle("");
    setDescription("");
    setStatus("OPEN");
    setAssignee("");
    setReporter(currentUser?.displayName || "Authenticated user");
    setPriority("MEDIUM");
    setDueDate("");
    setLabelsText("");

    if (onSuccess) {
      onSuccess();
    }
  }

  return (
    <form className={`task-form ${compact ? "task-form-compact" : ""}`} onSubmit={handleSubmit}>
      {!compact && <h2>Create Task</h2>}

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

      <div className="form-grid">
        <UserAutocomplete
          label="Assignee"
          value={assignee}
          onChange={setAssignee}
          placeholder="Assign to..."
        />

        <UserAutocomplete
          label="Reporter"
          value={reporter}
          onChange={setReporter}
          placeholder="Reporter"
          readOnly
        />

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
          Labels
          <input
            type="text"
            value={labelsText}
            onChange={(event) => setLabelsText(event.target.value)}
            placeholder="frontend, bug, aws"
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
      </div>

      <button className="button primary" type="submit" disabled={loading}>
        {loading ? "Creating..." : "Create Task"}
      </button>
    </form>
  );
}

function parseLabels(value) {
  return value
    .split(",")
    .map((label) => label.trim())
    .filter(Boolean);
}