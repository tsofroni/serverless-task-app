# Frontend & Authentication Troubleshooting

This section documents real-world issues encountered during development and how they were resolved.

---

## Issue 1: redirect_uri=undefined

### Problem

Login URL contained:

redirect_uri=undefined

### Cause

Incorrect environment variable name:

VITE_COGNITO_REDIRECT_URL

instead of:

VITE_COGNITO_REDIRECT_URI

### Fix

Corrected variable name in .env file.

---

## Issue 2: Invalid Request (Cognito)

### Problem

Cognito returned:

Invalid Request

### Cause

Mismatch between:
- frontend redirect URI
- Cognito callback URL

### Fix

Ensure exact match:

http://localhost:5173

---

## Issue 3: SSL Error

### Problem

ERR_SSL_PROTOCOL_ERROR

### Cause

Cognito used HTTPS but frontend used HTTP.

### Fix

Changed callback URL to:

http://localhost:5173

---

## Issue 4: CORS Error

### Problem

Browser blocked API requests due to CORS.

### Cause

CORS not enabled on API Gateway endpoints.

### Fix

Enabled CORS on:

- /tasks
- /tasks/{taskId}

Redeployed API.

---

## Issue 5: Form Submission Not Working

### Problem

Clicking "Create Task" did nothing.

### Console Error

The tag <from> is unrecognized

### Cause

Typo in component:

<from>

instead of:

<form>

### Fix

Corrected HTML tag.

---

## Issue 6: Failed to fetch

### Cause

- CORS issues
- API not reachable
- missing Authorization header

### Screenshot

[CORS Error](../screenshots/errors/frontend-cors-error.png)

### Fix

Resolved after fixing CORS configuration.