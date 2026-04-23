# Deployment Notes

## Overview

The application is deployed using a serverless architecture:

- Frontend: S3 + CloudFront
- Backend: API Gateway + Lambda
- Database: DynamoDB
- Authentication: Cognito

---

## Frontend Deployment

### Step 1: Build

npm run build

---

### Step 2: Upload to S3

- Upload contents of dist/ folder
- Do NOT upload the folder itself

---

### Step 3: CloudFront

- Origin: S3 bucket
- Default root object: index.html

---

### Step 4: Invalidate Cache

Path: /*

---

## Important Notes

### Environment Variables

Frontend must be rebuilt after changes.

Otherwise:
- Old values remain (e.g. localhost redirect)

---

### Cognito Integration

Ensure these match:

- Callback URLs
- Logout URLs
- Redirect URI in .env

---

## Common Issues

### Redirect to localhost

Cause:
- Old build deployed

Fix:
- Update .env
- Rebuild
- Upload
- Invalidate cache

---

### CORS errors

Cause:
- Missing headers in backend

Fix:
- Add CORS headers

---

## Summary

Deployment requires:

- Correct environment variables
- Fresh build
- CloudFront invalidation