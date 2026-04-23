# Security Notes

## Authentication

- Amazon Cognito used
- OAuth 2.0 Authorization Code Flow

---

## API Security

- Protected via Cognito Authorizer
- JWT required for requests

---

## CORS

Current:

Access-Control-Allow-Origin: *

Note:
- Fine for demo
- Should be restricted in production

---

## Recommendations

- Restrict CORS to known domains
- Use HTTPS
- Add AWS WAF