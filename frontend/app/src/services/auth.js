import {
  removeStoredCodeVerifier,
  removeToken,
  saveCodeVerifier,
} from "../utils/token";
import { generateCodeChallenge, generateCodeVerifier } from "../utils/pkce";

const {
  VITE_COGNITO_DOMAIN,
  VITE_COGNITO_CLIENT_ID,
  VITE_COGNITO_REDIRECT_URI,
  VITE_COGNITO_LOGOUT_URI,
  VITE_COGNITO_SCOPE,
} = import.meta.env;

export async function buildLoginUrl() {
  const codeVerifier = generateCodeVerifier();
  const codeChallenge = await generateCodeChallenge(codeVerifier);

  saveCodeVerifier(codeVerifier);

  const params = new URLSearchParams({
    client_id: VITE_COGNITO_CLIENT_ID,
    response_type: "code",
    scope: VITE_COGNITO_SCOPE,
    redirect_uri: VITE_COGNITO_REDIRECT_URI,
    code_challenge_method: "S256",
    code_challenge: codeChallenge,
  });

  return `${VITE_COGNITO_DOMAIN}/login?${params.toString()}`;
}

export async function login() {
  const loginUrl = await buildLoginUrl();
  window.location.href = loginUrl;
}

export function buildLogoutUrl() {
  const params = new URLSearchParams({
    client_id: VITE_COGNITO_CLIENT_ID,
    logout_uri: VITE_COGNITO_LOGOUT_URI,
  });

  return `${VITE_COGNITO_DOMAIN}/logout?${params.toString()}`;
}

export function logout() {
  removeToken();
  removeStoredCodeVerifier();
  window.location.href = buildLogoutUrl();
}

export async function exchangeCodeForToken(code, codeVerifier) {
  const tokenEndpoint = `${VITE_COGNITO_DOMAIN}/oauth2/token`;

  const body = new URLSearchParams({
    grant_type: "authorization_code",
    client_id: VITE_COGNITO_CLIENT_ID,
    code,
    redirect_uri: VITE_COGNITO_REDIRECT_URI,
    code_verifier: codeVerifier,
  });

  const response = await fetch(tokenEndpoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: body.toString(),
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(data.error_description || data.error || "Token exchange failed");
  }

  return data;
}