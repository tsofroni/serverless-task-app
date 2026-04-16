# Architecture Overview

This project uses a fully serverless architecture on AWS.

---

## 🔄 Request Flow

1. User logs in via Cognito
2. Cognito returns a JWT token
3. Client sends request with token
4. API Gateway validates token
5. Lambda processes request
6. DynamoDB stores or retrieves data
7. Response is returned to client

---

## 🔐 Authentication Flow

- User authenticates with Cognito
- JWT token is issued
- Token is passed in Authorization header
- API Gateway verifies token
- Lambda receives user identity from claims

[Successful Request with Authorization Header](screenshots/postman/postman-create-task-success.png)

---

## 🧩 Components

### API Gateway
Handles HTTP requests and routes them to Lambda.

### Lambda
Implements business logic.

### DynamoDB
Stores user tasks.

### Cognito
Handles authentication and user management.

---

## 🔒 Security Design

- No public access without token
- userId derived from JWT (not user input)
- per-user data isolation enforced

---

## 📊 Observability

- Logs available in CloudWatch
- Errors and requests can be traced

[CloudWatch Logs](screenshots/logs/cloudwatch-api-logs)