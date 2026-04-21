# Frontend Implementation

## Overview

The frontend is a React application built with Vite that interacts with a secured AWS serverless backend.

it is responsible for:

- Handling authentication via Cognito
- Managing application state
- Rendering tasks
- Sending API requests

---

## Authentication (Cognito Integration)

The application uses the OAuth 2.0 Authorization Code Flow.

### Flow Steps

1. User clicks login button
2. Redirect to Cognito Hosted UI
3. After login, Cognito redirects back to:

http://localhost:5173/?code=AUTH_CODE

4. Frontend exchanges code for tokens
5. Access token stored in memory
6. Token attached to API requests

---

## Key Files

### auth.js

Handles:
- all API requests
- attaches Authorization header

### TaskForm.jsx

Handles:
- creating new tasks
- form state
- submit logic

### TaskItem.jsx

Handles:
- rendering a single task
- updating status
- deleting task

---

## API Communication

All requests include:

Authorization: Bearer <access_token>

---

## Environment Variables

[Environment Variables](../../frontend/app/.env)