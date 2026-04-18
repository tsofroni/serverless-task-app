import { login } from "../services/auth";

export default function LoginButton() {
  return (
    <button
      className="button primary"
      onClick={() => {
        login().catch((error) => {
          console.error("Login failed:", error);
        });
      }}
    >
      Login with Cognito
    </button>
  );
}