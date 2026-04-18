import { useEffect, useState } from "react";
import Header from "./components/Header";
import LoginButton from "./components/LoginButton";
import LogoutButton from "./components/LogoutButton";
import TaskForm from "./components/TaskForm";
import TaskList from "./components/TaskList";
import StatusMessage from "./components/StatusMessage";
import { createTask, deleteTask, fetchTasks, updateTask } from "./services/api";
import {
  clearUrlHash,
  getStoredToken,
  getTokenFromUrl,
  saveToken,
} from "./utils/token";

export default function App() {
  const [token, setToken] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("info");

  useEffect(() => {
    const tokenFromUrl = getTokenFromUrl();

    if (tokenFromUrl) {
      saveToken(tokenFromUrl);
      setToken(tokenFromUrl);
      clearUrlHash();
      return;
    }

    const storedToken = getStoredToken();
    if (storedToken) {
      setToken(storedToken);
    }
  }, []);

  useEffect(() => {
    if (!token) return;
    loadTasks();
  }, [token]);

  async function loadTasks() {
    setLoading(true);
    setMessage("");

    try {
      const data = await fetchTasks(token);
      setTasks(data.items || []);
    } catch (error) {
      setMessage(error.message);
      setMessageType("error");
    } finally {
      setLoading(false);
    }
  }

  async function handleCreateTask(taskData) {
    setLoading(true);
    setMessage("");

    try {
      await createTask(token, taskData);
      setMessage("Task created successfully.");
      setMessageType("success");
      await loadTasks();
    } catch (error) {
      setMessage(error.message);
      setMessageType("error");
    } finally {
      setLoading(false);
    }
  }

  async function handleDeleteTask(taskId) {
    setLoading(true);
    setMessage("");

    try {
      await deleteTask(token, taskId);
      setMessage("Task deleted successfully.");
      setMessageType("success");
      await loadTasks();
    } catch (error) {
      setMessage(error.message);
      setMessageType("error");
    } finally {
      setLoading(false);
    }
  }

  async function handleStatusChange(taskId, updatedTask) {
    setLoading(true);
    setMessage("");

    try {
      await updatedTask(token, taskId, updatedTask);
      setMessage("Task updated successfully.");
      setMessageType("success");
      await loadTasks();
    } catch (error) {
      setMessage(error.message);
      setMessageType("error");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className = "app-container">
      <Header />

      {!token ? (
        <section className = "auth-section">
          <p>Please log in to manage your tasks.</p>
          <LoginButton />
        </section>
      ) : (
        <>
          <div className = "top-actions">
            <LogoutButton />
          </div>
          
          <StatusMessage message = {message} type = {messageType} />
          
          <div className = "dashboard-layout">
            <TaskForm onCreate = {handleCreateTask} loading={loading} />
            <TaskList
              tasks = {tasks}
              onDelete={handleDeleteTask}
              onStatusChange={handleStatusChange}
              loading={loading}
              />
            </div>
          </>
      )}
    </div>
  );
}