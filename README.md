# Serverless Task App (AWS)

A secure serverless task management application built on AWS using API Gateway, Lambda, DynamoDB and Cognito.

---

## 📌 Overview

This project demonstrates how to build a fully serverless backend with authentication and per-user data isolation.

Users can:
- register and log in
- create tasks
- view their own tasks
- update tasks
- delete tasks

All operations are protected using token-based authentication.

---

## 🏗️ Architecture

High-level flow:

User -> Cognito -> Token -> API Gateway -> Lambda -> DynamoDB

- Authentication handled by Amazon Cognito
- API exposed via API Gateway (REST API)
- Business logic implemented in AWS Lambda
- Data stored in DynamoDB (NoSQL)

(Screenshot: Architekturdiagramm oder AWS Services Übersicht)

---

## ⚙️ Tech Stack

- AWS API Gateway (REST API)
- AWS Lambda (Python)
- Amazon DynamoDB
- Amazon Cognito (User Pool)
- CloudWatch (Logging)
- Postman (Testing)

---

## 🚀 Features

- Secure authentication using Cognito
- Token-based authorization (JWT)
- Full CRUD operations for tasks
- Per-user data isolation
- Serverless architecture (no servers to manage)

---

## 🔐 Authentication

Users authenticate via Cognito and receive a JWT token.

This token must be included in every request:

Authorization: Bearer <token>

[Request with Authorization Header](screenshots/postman/postman-create-task-success.png)

---

## 📡 API Endpoints

| Method | Endpoint | Description |
|--------|----------|------------|
| POST | /tasks | Create a task |
| GET | /tasks | List all tasks |
| GET | /tasks/{taskId} | Get single task |
| PUT | /tasks/{taskId} | Update task |
| DELETE | /tasks/{taskId} | Delete task |

---

## 🗄️ Data Model (DynamoDB)

Table: Tasks

- Partition Key: userId
- Sort Key: taskId

Attributes:
- title
- description
- status
- createdAt
- updatedAt

---

## 🧪 Testing

The API was tested using Postman.

Test cases include:
- successful CRUD operations
- expired token (401)
- deleted task (404)
- invalid input

[Successful POST Request](screenshots/postman/postman-update-task-success)
[401 Unauthorized - expired token](screenshots/postman/postman-expired-token-error)
[404 Not Found - Task not found](screenshots/postman/postman-task-not-found-error)

---

## 📂 Project Structure

backend/
docs/
frontend/

---

## 📈 Current Status

✅ Backend fully implemented and tested 
⏳ Frontend in progress
⏳ Deployment (S3 + CloudFront) planned
⏳ WAF integration planned

---

## 📚 Lessons Learned

- DynamoDB is schema-less beyond key design
- Authentication flows must be handled carefully
- Debugging API issues requires CloudWatch logs
- Testing error scenarios is essential

---

## 🔮 Next Steps

- Build frontend (React)
- Integrate Cognito login UI
- Deploy frontend via S3 + CloudFront
- Add AWS WAF for security