export function decodeJwt(token) {
  if (!token) return null;

  try {
    const payload = token.split(".")[1];
    const base64 = payload.replace(/-/g, "+").replace(/_/g, "/");
    const decodedPayload = decodeURIComponent(
      atob(base64)
        .split("")
        .map((char) => {
          return `%${`00${char.charCodeAt(0).toString(16)}`.slice(-2)}`;
        })
        .join("")
    );

    return JSON.parse(decodedPayload);
  } catch (error) {
    console.error("Failed to decode JWT:", error);
    return null;
  }
}

export function getUserFromToken(token) {
  const claims = decodeJwt(token);

  if (!claims) {
    return {
      displayName: "Authenticated user",
      email: "",
      username: "",
      sub: "",
    };
  }

  return {
    displayName:
      claims.email ||
      claims["cognito:username"] ||
      claims.username ||
      "Authenticated user",
    email: claims.email || "",
    username: claims["cognito:username"] || claims.username || "",
    sub: claims.sub || "",
  };
}