import { useEffect, useState } from "react";
import Header from "./components/Header";
import LoginButton from "./components/LoginButton";
import LogoutButton from "./components/LogoutButton";
import TaskForm from "./components/TaskForm";
import TaskList from "./components/TaskList";
import StatusMessage from "./components/StatusMessage";
import { createTask, deleteTask, fetchTasks, updateTask } from "./services/api";
import { exchangeCodeForToken } from "./services/auth";
import {
  clearAuthParamsFromUrl,
  getCodeFromUrl,
  getStoredCodeVerifier,
  getStoredToken,
  removeStoredCodeVerifier,
  removeToken,
  saveToken,
} from "./utils/token";

export default function App() {
  const [token, setToken] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("info");
  const [authLoading, setAuthLoading] = useState(true);

  useEffect(() => {
    async function initializeAuth() {
      try {
        const code = getCodeFromUrl();

        if (code) {
          const codeVerifier = getStoredCodeVerifier();

          if (!codeVerifier) {
            throw new Error("PKCE code verifier missing. Please log in again.");
          }

          const tokenResponse = await exchangeCodeForToken(code, codeVerifier);
          const idToken = tokenResponse.id_token;

          if (!idToken) {
            throw new Error("No id_token returned from Cognito.");
          }

          saveToken(idToken);
          setToken(idToken);
          removeStoredCodeVerifier();
          clearAuthParamsFromUrl();
          return;
        }

        const storedToken = getStoredToken();
        if (storedToken) {
          setToken(storedToken);
        }
      } catch (error) {
        removeToken();
        removeStoredCodeVerifier();
        setMessage(error.message);
        setMessageType("error");
      } finally {
        setAuthLoading(false);
      }
    }

    initializeAuth();
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

      if (
        error.message.toLowerCase().includes("expired") ||
        error.message.toLowerCase().includes("unauthorized") ||
        error.message.toLowerCase().includes("forbidden")
      ) {
        removeToken();
        setToken(null);
      }

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
      await updateTask(token, taskId, updatedTask);
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

  if (authLoading) {
    return (
      <div className="app-container">
        <Header />
        <StatusMessage message="Checking login status..." type="info" />
      </div>
    );
  }

  return (
    <div className="app-container">
      <Header />

      {!token ? (
        <section className="auth-section">
          <p>Please log in to manage your tasks.</p>
          <LoginButton />
        </section>
      ) : (
        <>
          <div className="top-actions">
            <LogoutButton />
          </div>

          <StatusMessage message={message} type={messageType} />

          <div className="dashboard-layout">
            <TaskForm onCreate={handleCreateTask} loading={loading} />
            <TaskList
              tasks={tasks}
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