# Backend Overview

This backend is a serverless REST API built on AWS.

---

## 🧠 Architecture

API Gateway → Lambda → DynamoDB

Authentication is handled via Cognito.

Only authenticated users can access the API.

---

## 🔐 Authentication

- Cognito User Pool issues JWT tokens
- Token is sent in Authorization header
- API Gateway validates token using Cognito Authorizer
- Lambda extracts userId from token (sub claim)

(Screenshot: Cognito User Pool Overview)

---

## 📡 API Design

All routes are handled by a single Lambda function using proxy integration.

Routes:

- POST /tasks
- GET /tasks
- GET /tasks/{taskId}
- PUT /tasks/{taskId}
- DELETE /tasks/{taskId}

---

## ⚙️ Lambda Responsibilities

The Lambda function:

- parses incoming requests
- validates input data
- extracts user identity
- interacts with DynamoDB
- returns structured responses

---

## 🗄️ Data Model

Table: Tasks

Primary key:
- userId (partition key)
- taskId (sort key)

This ensures:
- each user only accesses their own data
- efficient queries per user

---

## 🚨 Error Handling

The API returns:

- 400 → invalid input
- 401 → unauthorized (invalid/expired token)
- 404 → resource not found
- 500 → internal error

(Screenshot: 404 Task not found in Postman)

---

## 🧪 Testing

Tested via Postman with:

- valid token → success
- expired token → 401
- deleted task → 404

(Screenshot: erfolgreicher GET /tasks)