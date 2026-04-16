# API Testing

The API was tested using Postman.

---

## ✅ Successful Requests

### Create Task

POST /tasks

(Screenshot: erfolgreicher POST Request + Response)

---

### List Tasks

GET /tasks

(Screenshot: erfolgreicher GET Request)

---

### Get Single Task

GET /tasks/{taskId}

(Screenshot: erfolgreicher GET by ID)

---

### Update Task

PUT /tasks/{taskId}

(Screenshot: erfolgreicher PUT Request)

---

### Delete Task

DELETE /tasks/{taskId}

(Screenshot: erfolgreicher DELETE Request)

---

## ❌ Error Cases

### Expired Token

Expected: 401 Unauthorized

(Screenshot: expired token Fehler)

---

### Task Not Found

Expected: 404 Not Found

(Screenshot: 404 Fehler nach Delete)

---

### Invalid Input

Expected: 400 Bad Request

(Screenshot: invalid JSON oder fehlendes Feld)

---

## 🧠 Observations

- API correctly enforces authentication
- Data is isolated per user
- Error handling works as expected
- System behaves reliably across scenarios