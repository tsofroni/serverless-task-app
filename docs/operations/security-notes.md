# Security Notes

## 🔐 Authentication

Authentication is implemented using Amazon Cognito Hosted UI.

The frontend uses:

- OAuth 2.0 Authorization Code Flow
- OpenID Connect (OIDC)
- JWT-based authentication

Benefits of this approach:

- secure login flow
- no password handling inside frontend code
- AWS-managed authentication
- scalable multi-user support

---

## 👤 User Isolation

Tasks are separated by authenticated user identity.

Each API request includes:

- Cognito JWT access token
- authenticated user information

The backend extracts the user identity from the JWT token and only returns tasks belonging to that specific user.

---

## 🌐 HTTPS & CloudFront

Frontend delivery uses:

- Amazon S3
- Amazon CloudFront

Benefits:

- HTTPS delivery
- low latency global caching
- secure frontend hosting

---

## 🛡️ CORS Protection

CORS was explicitly configured on API Gateway routes:

- `/tasks`
- `/tasks/{taskId}`

Allowed origins:

- localhost development environment
- CloudFront production distribution

---

## 🔑 OAuth Flow

The application uses Authorization Code Flow instead of Implicit Flow.

Advantages:

- more secure token handling
- recommended by AWS
- production-ready authentication architecture

---

## ⚠️ Security Challenges Encountered

### Redirect URI mismatch

Issue:
- `redirect_uri=undefined`

Root cause:
- incorrect environment variable naming

Fix:
- corrected `.env` variable names

---

### HTTPS/HTTP mismatch

Issue:
- SSL protocol errors

Root cause:
- Cognito callback configured with HTTPS while frontend used HTTP localhost

Fix:
- aligned callback URLs correctly

---

### JWT Authorization Issues

Issue:
- API requests failed after login

Root cause:
- missing Authorization header

Fix:
- implemented token forwarding from frontend to backend