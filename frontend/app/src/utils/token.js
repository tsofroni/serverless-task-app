export function getTokenFromUrl() {
    const hash = window.location.hash;

    if (!hash || !hash.includes("id_token=")) {
        return null;
    }

    const params = new URLSearchParams(hash.substring(1));
    return params.get("id_token");
}

export function saveToken(token) {
    localStorage.setItem("id_token", token);
}

export function getSortedToken() {
    return localStorage.getItem("id_token");
}

export function removeToken() {
    localStorage.removeItem("id_token");
}

export function clearUrlHash() {
    if (window.location.hash) {
        window.history.replaceState(
            null,
            document.title,
            window.location.pathname + window.location.search
        );
    }
}