import { Droppable } from "@hello-pangea/dnd";
import TaskCard from "./TaskCard";

export default function Column({ status, tasks }) {
  return (
    <div className="column">
      <h2>{status}</h2>

      <Droppable droppableId={status}>
        {(provided) => (
          <div
            className="column-content"
            ref={provided.innerRef}
            {...provided.droppableProps}
          >
            {tasks.map((task, index) => (
              <TaskCard key={task.taskId} task={task} index={index} />
            ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </div>
  );
}