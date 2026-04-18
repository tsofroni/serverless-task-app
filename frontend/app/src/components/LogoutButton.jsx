import { logout } from "../services/auth";
export default function LogoutButton() {
    return (
        <button className = "button secondary" onClick = {logout}>
            Logout
        </button>
    );
}