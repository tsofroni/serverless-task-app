# Lessons Learned

## 🧠 Major Technical Learnings

This project evolved from a simple CRUD API into a production-style serverless application.

Throughout development many real-world engineering challenges were encountered.

---

## 🔐 Authentication & OAuth

Implemented:

- Amazon Cognito Hosted UI
- OAuth 2.0 Authorization Code Flow
- JWT authentication

Key learnings:

- OAuth callback URLs must match exactly
- HTTPS vs HTTP mismatches can break authentication
- Authorization headers must be forwarded correctly
- Cognito Hosted UI simplifies authentication significantly

---

## 🌐 CloudFront & Frontend Hosting

Migrated frontend from local-only Vite development to production hosting with:

- S3
- CloudFront

Key learnings:

- CloudFront aggressively caches frontend assets
- invalidations are important during deployments
- frontend production builds behave differently from local dev builds

---

## 🔄 CI/CD

Implemented:

- frontend deployment pipeline
- backend deployment pipeline

Key learnings:

- automated deployments significantly improve workflow
- GitHub Actions debugging is an important cloud engineering skill
- deployment packaging structure matters for Lambda

---

## 🛠️ Troubleshooting Experience

Several production-style issues occurred:

- CORS failures
- OAuth redirect issues
- Lambda import errors
- broken frontend production builds
- CloudFront cache inconsistencies

This provided valuable troubleshooting experience similar to real cloud environments.

---

## 🎨 Frontend Engineering

Frontend evolved into a Jira-inspired Kanban board.

Implemented:

- drag & drop
- filters
- task detail modal
- due dates
- labels
- priorities
- responsive design
- animations
- toast notifications

Key learnings:

- frontend state management becomes increasingly important
- UX polish significantly improves application quality
- reusable React components simplify scaling features

---

## 🚀 Overall Outcome

The project now demonstrates:

- serverless architecture
- authentication
- frontend engineering
- CI/CD
- cloud troubleshooting
- AWS production concepts
- modern UX patterns

The application became significantly more realistic and production-oriented compared to the initial CRUD implementation.