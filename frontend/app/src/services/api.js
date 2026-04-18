const { VITE_API_BASE_URL } = import.meta.env;

async function apiRequest(path, method = "GET", token, body = null) {
    const headers = {
        Authorization: `Bearer ${token}`,
    };

    if (body) {
        headers["Content-Type"] = "application/json";
    }

    const response = await fetch(`${VITE_API_BASE_URL}${path}`, {
        method,
        headers,
        body: body ? JSON.stringify(body) : null,
    });

    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
        throw new Error(data.message || "Request failed");
    }

    return data;
}

export function fetchTasks(token) {
    return apiRequest("/tasks", "GET", token);
}

export function createTask(token, task) {
    return apiRequest("/tasks", "POST", token, task);
}

export function updateTask(token, taskId, task) {
    return apiRequest(`/tasks/${taskId}`, "PUT", token, task);
}

export function deleteTask(token, taskId, task) {
    return apiRequest(`/tasks/${taskId}`, "DELETE", token);
}