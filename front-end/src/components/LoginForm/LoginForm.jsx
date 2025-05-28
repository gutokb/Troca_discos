// LoginForm.jsx
import "./LoginForm.css";
import { useNavigate } from "react-router-dom";

export default function LoginForm() {
    const navigate = useNavigate();

    async function handleSubmit(event) {
        event.preventDefault();
        const formData = new FormData(event.target);
        const loginData = {
            email: formData.get("email"),
            password: formData.get("password")
        };

        try {
            const response = await fetch("http://localhost:3001/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(loginData)
            });

            const data = await response.json();

            if (response.ok) {
                // salva dados no localStorage
                localStorage.setItem("token", data.token);
                localStorage.setItem("user", JSON.stringify(data.user));

                // redireciona com base no role
                if (data.user.role === "ADMIN") {
                    navigate("/admin");
                } else {
                    navigate("/user");
                }
            } else {
                alert(data.message || "Erro no login");
            }
        } catch (error) {
            console.error("Erro de rede:", error);
            alert("Erro ao conectar com o servidor");
        }
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
                <input id="password" name="password" type="password" placeholder="annieru0k2" required />
            </div>
            <p className="register-text">
                Não possui uma conta?
                <span className="register-link" onClick={navigateRegister}> Registre-se agora</span>
            </p>
            <button className="login-button" type="submit">Login</button>
        </form>
    );
}
