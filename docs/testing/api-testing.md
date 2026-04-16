# API Testing

The API was tested using Postman.

---

## ✅ Successful Requests

### Create Task

POST /tasks

[Successful POST Request](screenshots/postman/postman-create-task-success.png)

---

### List Tasks

GET /tasks

[Successful GET Request](screenshots/postman/postman-get-task-success.png)

---

### Get Single Task

GET /tasks/{taskId}

[Successful GET by ID Request](screenshots/postman/postman-get-task-by-id-success.png)

---

### Update Task

PUT /tasks/{taskId}

[Successful PUT Request](screenshots/postman/postman-update-task-success.png)

---

### Delete Task

DELETE /tasks/{taskId}

[Successful DELETE Request](screenshots/postman/postman-delete-task-success.png)

---

## ❌ Error Cases

### Expired Token

Expected: 401 Unauthorized

[Expired Token Error](screenshots/postman/postman-expired-token-error.png)

---

### Task Not Found

Expected: 404 Not Found

[Task not found Error](screenshots/postman/postman-task-not-found-error.png)

---

### Invalid Input

Expected: 400 Bad Request

[Invalid JSON](screenshots/postman/postman-create-task-validation-error.png)

---

## 🧠 Observations

- API correctly enforces authentication
- Data is isolated per user
- Error handling works as expected
- System behaves reliably across scenarios