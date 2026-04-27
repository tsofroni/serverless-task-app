import { useEffect, useMemo, useState } from "react";
import Header from "./components/Header";
import LoginButton from "./components/LoginButton";
import LogoutButton from "./components/LogoutButton";
import KanbanBoard from "./components/KanbanBoard";
import ToastContainer from "./components/ToastContainer";
import BoardControls from "./components/BoardControls";
import CreateTaskModal from "./components/CreateTaskModal";
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
import { getUserFromToken } from "./utils/user";

export default function App() {
  const [token, setToken] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [authLoading, setAuthLoading] = useState(true);
  const [toasts, setToasts] = useState([]);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [priorityFilter, setPriorityFilter] = useState("ALL");
  const [onlyMine, setOnlyMine] = useState(false);

  const filteredTasks = useMemo(() => {
    const normalizedSearch = searchTerm.trim().toLowerCase();
    const currentUserName = currentUser?.displayName?.toLowerCase();

    return tasks.filter((task) => {
      const matchesSearch =
        !normalizedSearch ||
        task.title?.toLowerCase().includes(normalizedSearch) ||
        task.description?.toLowerCase().includes(normalizedSearch) ||
        task.assignee?.toLowerCase().includes(normalizedSearch) ||
        task.reporter?.toLowerCase().includes(normalizedSearch) ||
        task.labels?.some((label) =>
          label.toLowerCase().includes(normalizedSearch)
        );

      const matchesStatus =
        statusFilter === "ALL" || task.status === statusFilter;

      const matchesPriority =
        priorityFilter === "ALL" ||
        (task.priority || "MEDIUM") === priorityFilter;

      const matchesMine =
        !onlyMine ||
        (currentUserName &&
          task.assignee?.toLowerCase() === currentUserName);

      return matchesSearch && matchesStatus && matchesPriority && matchesMine;
    });
  }, [tasks, searchTerm, statusFilter, priorityFilter, onlyMine, currentUser]);

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
          setCurrentUser(getUserFromToken(idToken));
          removeStoredCodeVerifier();
          clearAuthParamsFromUrl();

          addToast({
            type: "success",
            title: "Signed in successfully",
            message: "Your task board is ready.",
          });

          return;
        }

        const storedToken = getStoredToken();

        if (storedToken) {
          setToken(storedToken);
          setCurrentUser(getUserFromToken(storedToken));
        }
      } catch (error) {
        removeToken();
        removeStoredCodeVerifier();

        addToast({
          type: "error",
          title: "Authentication failed",
          message: error.message,
        });
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

  function addToast({ type, title, message }) {
    const id = crypto.randomUUID();

    setToasts((currentToasts) => [
      ...currentToasts,
      {
        id,
        type,
        title,
        message,
      },
    ]);

    window.setTimeout(() => {
      removeToast(id);
    }, 4500);
  }

  function removeToast(id) {
    setToasts((currentToasts) =>
      currentToasts.filter((toast) => toast.id !== id)
    );
  }

  async function loadTasks() {
    setLoading(true);

    try {
      const data = await fetchTasks(token);
      setTasks(data.items || []);
    } catch (error) {
      addToast({
        type: "error",
        title: "Failed to load tasks",
        message: error.message,
      });

      if (
        error.message.toLowerCase().includes("expired") ||
        error.message.toLowerCase().includes("unauthorized") ||
        error.message.toLowerCase().includes("forbidden")
      ) {
        removeToken();
        setToken(null);
        setCurrentUser(null);
      }
    } finally {
      setLoading(false);
    }
  }

  async function handleCreateTask(taskData) {
    setLoading(true);

    try {
      await createTask(token, taskData);

      addToast({
        type: "success",
        title: "Task created",
        message: `"${taskData.title}" was added to the board.`,
      });

      await loadTasks();
      return true;
    } catch (error) {
      addToast({
        type: "error",
        title: "Task could not be created",
        message: error.message,
      });

      return false;
    } finally {
      setLoading(false);
    }
  }

  async function handleDeleteTask(taskId) {
    setLoading(true);

    try {
      await deleteTask(token, taskId);

      addToast({
        type: "success",
        title: "Task deleted",
        message: "The task was removed from the board.",
      });

      await loadTasks();
    } catch (error) {
      addToast({
        type: "error",
        title: "Task could not be deleted",
        message: error.message,
      });
    } finally {
      setLoading(false);
    }
  }

  async function handleUpdateTask(taskId, updates) {
    setLoading(true);

    try {
      await updateTask(token, taskId, updates);

      addToast({
        type: "success",
        title: "Task updated",
        message: "The task was updated successfully.",
      });

      await loadTasks();
    } catch (error) {
      addToast({
        type: "error",
        title: "Task could not be updated",
        message: error.message,
      });
    } finally {
      setLoading(false);
    }
  }

  if (authLoading) {
    return (
      <div className="app-container">
        <Header />
        <p>Checking login status...</p>
        <ToastContainer toasts={toasts} onRemove={removeToast} />
      </div>
    );
  }

  return (
    <div className="app-container">
      <Header />

      <ToastContainer toasts={toasts} onRemove={removeToast} />

      {!token ? (
        <section className="auth-section">
          <p>Please log in to manage your tasks.</p>
          <LoginButton />
        </section>
      ) : (
        <>
          <div className="top-actions">
            <button
              className="button primary"
              type="button"
              onClick={() => setIsCreateModalOpen(true)}
            >
              Create Task
            </button>

            {currentUser && (
              <div className="current-user-pill">
                <span className="current-user-avatar">
                  {currentUser.displayName.charAt(0).toUpperCase()}
                </span>
                <span>{currentUser.displayName}</span>
              </div>
            )}

            <LogoutButton />
          </div>

          <div className="dashboard-layout board-only">
            <div className="board-area">
              <BoardControls
                searchTerm={searchTerm}
                onSearchChange={setSearchTerm}
                statusFilter={statusFilter}
                onStatusFilterChange={setStatusFilter}
                priorityFilter={priorityFilter}
                onPriorityFilterChange={setPriorityFilter}
                onlyMine={onlyMine}
                onOnlyMineChange={setOnlyMine}
                visibleCount={filteredTasks.length}
                totalCount={tasks.length}
              />

              <KanbanBoard
                tasks={filteredTasks}
                onUpdate={handleUpdateTask}
                onDelete={handleDeleteTask}
                loading={loading}
              />
            </div>
          </div>

          <CreateTaskModal
            isOpen={isCreateModalOpen}
            onClose={() => setIsCreateModalOpen(false)}
            onCreate={handleCreateTask}
            loading={loading}
            currentUser={currentUser}
          />
        </>
      )}
    </div>
  );
}