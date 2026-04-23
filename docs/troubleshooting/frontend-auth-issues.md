# Frontend & Authentication Troubleshooting

This section documents real-world issues encountered during development and how they were resolved.

The issues listed here reflect actual debugging scenarios across:

- Frontend (React)
- Authentication (Cognito)
- API Gateway
- Deployment (S3 + CloudFront)

---

## Issue 1: redirect_uri=undefined

### Problem

Login URL contained:

redirect_uri=undefined

---

### Cause

Incorrect environment variable name:

VITE_COGNITO_REDIRECT_URL

instead of:

VITE_COGNITO_REDIRECT_URI

---

### Fix

Corrected variable name in `.env` file.

---

### Key Insight

Vite only exposes variables prefixed with `VITE_`.

If the variable name is incorrect, it will not be available in the frontend, resulting in undefined values in runtime.

---

## Issue 2: Invalid Request (Cognito)

### Problem

Cognito returned:

Invalid request

---

### Cause

Mismatch between:

- Frontend redirect URI
- Cognito allowed callback URLs

---

### Fix

Ensure exact match:

http://localhost:5173

---

### Key Insight

Cognito requires an exact match for redirect URIs.

Even small differences such as:

- missing trailing slash
- http vs https

will result in authentication failure.

---

## Issue 3: SSL Error

### Problem

ERR_SSL_PROTOCOL_ERROR

---

### Cause

Cognito redirect configured with:

https://localhost:5173

while the frontend was running on:

http://localhost:5173

---

### Fix

Updated Cognito callback URLs to:

http://localhost:5173

---

### Key Insight

Local development servers (like Vite) do not use HTTPS by default.

Protocol mismatch leads to browser-level connection errors.

---

## Issue 4: CORS Error

### Problem

Browser blocked API requests.

---

### Screenshot

[CORS Error](../screenshots/errors/frontend-cors-error.png)

---

### Cause

CORS was not properly configured in:

- API Gateway
- Lambda responses

---

### Fix

Enabled CORS for:

- /tasks
- /tasks/{taskId}

Added headers in Lambda:

Access-Control-Allow-Origin  
Access-Control-Allow-Headers  
Access-Control-Allow-Methods  

---

### Key Insight

CORS must be configured in BOTH:

1. API Gateway (OPTIONS / preflight)
2. Lambda response headers

Missing either will result in blocked requests.

---

## Issue 5: Form Submission Not Working

### Problem

Clicking "Create Task" did nothing.

---

### Console Error

The tag <from> is unrecognized

---

### Cause

Typo in component:

<from>

instead of:

<form>

---

### Fix

Corrected HTML tag.

---

### Key Insight

React does not recognize invalid HTML elements.

This prevented the form submission event from firing.

---

## Issue 6: Failed to fetch

### Problem

Frontend displayed:

Failed to fetch

---

### Cause

- CORS issues
- API unreachable
- missing Authorization header

---

### Fix

Resolved after fixing CORS configuration and ensuring proper API URL usage.

---

### Key Insight

"Failed to fetch" is a generic browser error and often hides the real issue.

Always inspect the Network tab in DevTools.

---

## Issue 7: CloudFront Redirecting to localhost

### Problem

After deployment, login redirected to:

http://localhost:5173/?code=...

---

### Cause

Frontend was built with old `.env` values.

CloudFront served outdated bundled JavaScript.

---

### Fix

1. Updated `.env`:

VITE_COGNITO_REDIRECT_URI=https://<cloudfront-url>

2. Rebuilt frontend:

npm run build

3. Re-uploaded `dist/` to S3

4. Invalidated CloudFront cache:

Path: /*

---

### Key Insight

Environment variables are embedded during build time.

CloudFront caching can cause outdated configurations to persist.

---

## Issue 8: CloudFront Caching Old Version

### Problem

Frontend changes were not visible after deployment.

---

### Cause

CloudFront cached old files.

---

### Fix

Created invalidation:

Path: /*

---

### Key Insight

CloudFront aggressively caches assets.

Invalidation is required after every deployment.

---

## Summary

This project required debugging across multiple layers:

- Frontend configuration
- Authentication flow
- API integration
- Cloud infrastructure

Key takeaways:

- Always verify environment variables
- Ensure exact URL matching in Cognito
- Handle CORS at multiple levels
- Understand build-time vs runtime configuration
- Use DevTools (Network + Console) extensively