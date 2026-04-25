export default function BoardControls({
  searchTerm,
  onSearchChange,
  statusFilter,
  onStatusFilterChange,
  priorityFilter,
  onPriorityFilterChange,
  onlyMine,
  onOnlyMineChange,
  visibleCount,
  totalCount,
}) {
  return (
    <section className="board-controls">
      <div className="board-controls-header">
        <div>
          <h2>Task Board</h2>
          <p>
            Showing {visibleCount} of {totalCount} tasks
          </p>
        </div>
      </div>

      <div className="board-controls-grid">
        <label>
          Search
          <input
            type="search"
            value={searchTerm}
            onChange={(event) => onSearchChange(event.target.value)}
            placeholder="Search title, description, assignee..."
          />
        </label>

        <label>
          Status
          <select
            value={statusFilter}
            onChange={(event) => onStatusFilterChange(event.target.value)}
          >
            <option value="ALL">All statuses</option>
            <option value="OPEN">OPEN</option>
            <option value="IN_PROGRESS">IN_PROGRESS</option>
            <option value="DONE">DONE</option>
          </select>
        </label>

        <label>
          Priority
          <select
            value={priorityFilter}
            onChange={(event) => onPriorityFilterChange(event.target.value)}
          >
            <option value="ALL">All priorities</option>
            <option value="LOW">LOW</option>
            <option value="MEDIUM">MEDIUM</option>
            <option value="HIGH">HIGH</option>
          </select>
        </label>

        <label className="checkbox-control">
          <input
            type="checkbox"
            checked={onlyMine}
            onChange={(event) => onOnlyMineChange(event.target.checked)}
          />
          Only assigned to me
        </label>
      </div>
    </section>
  );
}