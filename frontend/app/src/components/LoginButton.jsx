import { login } from "../services/auth";

export default function LoginButton() {
    return (
        <button className = "button primary" onClick = {login}>
            Login with Cognito
        </button>
    );
}