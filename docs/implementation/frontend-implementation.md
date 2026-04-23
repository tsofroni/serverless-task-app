# Frontend Implementation

## Overview

The frontend of this project is a React-based single-page application built with Vite.
It provides a user interface for interacting with the serverless backend API.

The application supports:

- User authentication via Amazon Cognito
- Creating, viewing, updating and deleting tasks
- Secure API communication using JWT tokens

---

## Tech Stack

- React
- Vite
- JavaScript (ES6+)
- Fetch API 
- Amazon Cognito (Hosted UI)

---

## Project Structure

frontend/\
└── app/\
├── src/\
│ ├── components/\
│ │ ├── TaskForm.jsx\
│ │ └── TaskItem.jsx\
│ ├── services/\
│ │ ├── api.js\
│ │ ├── auth.js\
│ │ └── token.js\
│ ├── App.jsx\
│ └── main.jsx\
├── .env\
└── package.json\

---

## Authentication Flow (Cognito)

The application uses the **Authorization Code Flow** with Amazon Cognito.

### Flow Steps

1. User clicks **Login with Cognito**
2. User is redirected to Cognito Hosted UI
3. User logs in
4. Cognito redirects back to frontend with `?code=...`
5. Frontend exchanges code for tokens
6. Tokens are stored in memory/localStorage
7. API requests include `Authorization: Bearer <token>`

---

## Environment Variables

[Environment Variables](../../frontend/app/.env)

### Important Notes

- Variables must start with VITE_
- Wrong naming leads to redirect_uri=undefined

---

## API Communication

Example request:

fetch(`${API_BASE_URL}/tasks`, {\
  method: "GET",\
  headers: {\
    "Authorization": `Bearer ${token}`,\
    "Content-Type": "application/json"\
  }\
})\

---

## Core Components

### TaskForm.jsx

Responsible for:
- Creating new tasks
- Handling form input
- Sending POST request

### TaskItem.jsx

Responsible for:
- Displaying tasks
- Updating status
- Deleting tasks

---

## Deployment

The frontend is deployed using:

- Amazon S3
- Amazon CloudFront

### Steps

1. npm run build
2. Upload dist/ contents to S3
3. Invalidate CloudFront cache

---

## Key Issues & Lessons Learned

### redirect_uri undefined

Cause:
- Wrong environment variable name

Fix:
- Use VITE_COGNITO_REDIRECT_URI

---

### HTTPS vs HTTP mismatch

Cause:
- Cognito configured with HTTPS
- App running on HTTP

Fix:
- Match protocols exactly

---

### CORS errors

Cause:
- Missing headers in backend

Fix:
- Add Access-Control-Allow-Origin

---

### CloudFront caching issue

Cause:
- Old frontend bundle cached

Fix:
- Create invalidation: /*

---

## Conclusion

The frontend demonstrates:

- Cognito authentication
- Secure API integration
- Real-world debugging
- Production deployment