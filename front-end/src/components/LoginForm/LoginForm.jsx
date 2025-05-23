// LoginForm.jsx
import "./LoginForm.css"
import {useNavigate} from "react-router-dom";

/*
This is the login form in the center of the login page
 */

export default function LoginForm() {

    const navigate = useNavigate();

    function handleSubmit(event) {
        event.preventDefault();
        const formData = new FormData(event.target);
        const loginData = {
            email: formData.get('email'),
            password: formData.get('password')
        };
        // Needs to handle authentication logic
        navigate("/");
    }

    function navigateRegister() {
        navigate("/");
    }

    return (
        <form onSubmit={handleSubmit} className="login-form">
            <div className="form-field">
                <label htmlFor="email">Email</label>
                <input id="email" name="email" type="text" placeholder="michael@jackson.com" required />
            </div>
            <div className="form-field">
                <label htmlFor="password">Senha</label>
                <input id="password" name="password" type="password" placeholder="annieru0k2" required/>
            </div>
            <p className="register-text">
                Não possui uma conta?
                <span className="register-link" onClick={navigateRegister}> Registre-se agora</span>
            </p>
            <button className="login-button" type="submit">Login</button>
        </form>
    )
}