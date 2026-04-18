import { removeToken } from "../utils/token";

const {
    VITE_COGNITO_DOMAIN,
    VITE_COGNITO_CLIENT_ID,
    VITE_COGNITO_REDIRECT_URL,
    VITE_COGNITO_LOGOUT_URL,
    VITE_COGNITO_RESPONSE_TYPE,
    VITE_COGNITO_SCOPE,
} = import.meta.env;

export function buildLoginUrl() {
  return (
    `${VITE_COGNITO_DOMAIN}/login` +
    `?client_id=${encodeURIComponent(VITE_COGNITO_CLIENT_ID)}` +
    `&response_type=${encodeURIComponent(VITE_COGNITO_RESPONSE_TYPE)}` +
    `&scope=${encodeURIComponent(VITE_COGNITO_SCOPE)}` +
    `&redirect_uri=${encodeURIComponent(VITE_COGNITO_REDIRECT_URI)}`
  );
}

export function buildLogoutUrl() {
  return (
    `${VITE_COGNITO_DOMAIN}/logout` +
    `?client_id=${encodeURIComponent(VITE_COGNITO_CLIENT_ID)}` +
    `&logout_uri=${encodeURIComponent(VITE_COGNITO_LOGOUT_URI)}`
  );
}

export function buildLogoutUrl() {
  return (
    `${VITE_COGNITO_DOMAIN}/logout` +
    `?client_id=${encodeURIComponent(VITE_COGNITO_CLIENT_ID)}` +
    `&logout_uri=${encodeURIComponent(VITE_COGNITO_LOGOUT_URI)}`
  );
}

export function login() {
  window.location.href = buildLoginUrl();
}

export function logout() {
  removeToken();
  window.location.href = buildLogoutUrl();
}