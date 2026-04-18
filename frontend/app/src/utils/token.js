export function getCodeFromUrl() {
  const params = new URLSearchParams(window.location.search);
  return params.get("code");
}

export function saveToken(token) {
  localStorage.setItem("id_token", token);
}

export function getStoredToken() {
  return localStorage.getItem("id_token");
}

export function removeToken() {
  localStorage.removeItem("id_token");
  localStorage.removeItem("pkce_code_verifier");
}

export function saveCodeVerifier(codeVerifier) {
  localStorage.setItem("pkce_code_verifier", codeVerifier);
}

export function getStoredCodeVerifier() {
  return localStorage.getItem("pkce_code_verifier");
}

export function removeStoredCodeVerifier() {
  localStorage.removeItem("pkce_code_verifier");
}

export function clearAuthParamsFromUrl() {
  const url = new URL(window.location.href);
  url.searchParams.delete("code");
  window.history.replaceState({}, document.title, url.pathname);
}