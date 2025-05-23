// Login.jsx
import "./Login.css"
import LoginForm from "../../components/LoginForm/LoginForm.jsx";
import Navbar from "../../components/Navbar/Navbar.jsx";

export default function Login() {
    return (
        <>
            <Navbar/>
            <main className="login-main">
                <div className="login-container">
                    <h1>Login</h1>
                    <LoginForm/>
                </div>
            </main>
        </>
    )
}