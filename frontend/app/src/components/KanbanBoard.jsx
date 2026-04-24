import { DragDropContext } from "@hello-pangea/dnd";
import Column from ".Column";

export default function KanbanBoard({ tasks, onUpdate }) {
    const columns = {
        OPEN: tasks.filter(t => t.status === "OPEN"),
        IN_PROGRESS: tasks.filter(t => t.status === "IN_PROGRESS"),
        DONE: tasks.filter(t => t.status === "DONE"),
    };

    function handleDragEnd(result) {
        const { destination, source, draggableId } = result;

        if (!destination) return;

        const newStatus = destination.droppableId;

        if (source.droppableId === destination.droppableId) return;

        onUpdate(draggableId, { status: newStatus });
    }

    return (
        <DragDropContext onDragEnd={handleDragEnd}>
            <div className="kanban-board">
                {Object.keys(columns).map((status) => (
                    <Column key={status} status={status} tasks={columns[status]} />
                ))}
            </div>
        </DragDropContext>
    );
}