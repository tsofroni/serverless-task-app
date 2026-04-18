import { useState } from "react";

export default function TaskForm({ onCreate, loading }) {
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [status, setStatus] = useState("OPEN");

    async function handleSubmit(event) {
        event.preventDefault();

        await onCreate({
            title,
            description,
            status,
        });

        setTitle("");
        setDescription("");
        setStatus("OPEN");
    }

    return (
        <from className = "task-form" onSubmit  ={handleSubmit}>
            <h2>Create Task</h2>

            <label>
                Title
                <input
                    type = "text"
                    value = {title}
                    onChange = {(event) => setTitle(event.target.value)}
                    placeholder = "Enter task title"
                    required
                /> 
            </label>

            <label>
                Status
                <select
                    value = {status}
                    onChange = {(event) => setStatus(event.target.value)}
                >
                    <option value = "OPEN">OPEN</option>
                    <option value = "IN_PROGRESS">IN_PROGRESS</option>
                    <option value = "DONE">DONE</option>
                </select>
            </label>

            <button className = "button primary" type = "submit" disabled = {loading}>
                {loading ? "Creating..." : "Create Task"}
            </button>
        </from>
    );
}