# Frontend Testing

## Overview

The frontend was tested manually using browser tools.

---

## Authentication Testing

### Login

Steps:
1. Click "Login with Cognito"
2. Login via Hosted UI
3. Redirect back

Expected:
- User authenticated
- Tokens available
- Tasks loaded

---

### Logout

Steps:
1. Click "Logout"

Expected:
- Session cleared
- Login required again

---

## API Testing via UI

### Create Task

Steps:
1. Enter title
2. Click "Create Task"

Expected:
- Task appears

---

### Update Task

Steps:
1. Change status

Expected:
- Status updates

---

### Delete Task

Steps:
1. Click delete

Expected:
- Task removed

---

## Error Scenarios

### CORS Error

Observed:
- Failed to fetch

Cause:
- Missing CORS headers

---

### Auth Errors

Observed:
- Invalid request

Cause:
- Wrong Cognito config

---

## Tools Used

- Browser DevTools
- Network tab
- Console logs

---

## Conclusion

All critical frontend features work after resolving configuration issues.