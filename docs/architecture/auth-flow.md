# Authentication Flow (Detailed)

## OAuth 2.0 Authorization Code Flow

The application uses Cognito Hosted UI with Authorization Code Flow.

---

## Step-by-step

1. User clicks login

2. Redirect to Cognito:

https://eu-central-19gx4wifh7.auth.eu-central-1.amazoncognito.com/login?client_id=75ob17tr7dpm9833mdat8lnlh2&redirect_uri=...&response_type=code

3. User logs in

4. Cognito redirects back:

http://localhost:5173/?code=XYZ

5. Frontend exchanges code:

POST /oauth2/token

6. Tokens received:
- access_token
- id_token
- refresh_token

7. Access token used for API requests