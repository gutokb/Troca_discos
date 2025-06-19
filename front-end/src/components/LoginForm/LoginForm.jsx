// Importa o CSS específico para o formulário de login
import "./LoginForm.css";

// Importa o hook de navegação para redirecionar o usuário após o login
import { useNavigate } from "react-router-dom";

// Importa a URL da API (dev ou prod) configurada separadamente
import { API_URL } from "../../config/api";

// Componente funcional do React responsável pelo formulário de login
export default function LoginForm() {

    // Hook de navegação do React Router
    const navigate = useNavigate();

    /**
     * Função que trata o envio do formulário.
     * É assíncrona porque faz requisição ao servidor.
     */
    async function handleSubmit(event) {
        event.preventDefault(); // Evita o recarregamento da página ao submeter o formulário

        // Extrai os dados do formulário
        const formData = new FormData(event.target);
        const loginData = {
            email: formData.get("email"),       // Recupera o valor do campo email
            password: formData.get("password")  // Recupera o valor do campo senha
        };

        try {
            // Envia os dados para o backend, no endpoint de login
            const response = await fetch(`${API_URL}/users/login`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(loginData)
            });

            // Converte a resposta para JSON
            const data = await response.json();

            // Se o login for bem-sucedido (status HTTP 200–299)
            if (response.ok) {
                // Salva o token e os dados do usuário no localStorage (para sessões futuras)
                localStorage.setItem("token", data.token); // Ainda que você não esteja usando agora, pode ser útil futuramente
                localStorage.setItem("user", JSON.stringify(data.user));

                // Redireciona para a área correta com base no papel do usuário
                if (data.user.role === "ADMIN") {
                    navigate("/admin");  // Admins vão para o dashboard
                } else {
                    navigate("/profile"); // Usuários comuns vão para o perfil
                }
            } else {
                // Exibe uma mensagem de erro retornada pelo backend
                alert(data.message || "Erro no login");
            }
        } catch (error) {
            // Caso ocorra erro de rede ou o servidor esteja fora, mostra uma mensagem apropriada
            console.error("Erro de rede:", error);
            alert("Erro ao conectar com o servidor");
        }
    }

    /**
     * Função para redirecionar o usuário para a página de registro.
     * É usada ao clicar no link "Registre-se agora".
     */
    function navigateRegister() {
        navigate("/register");
    }

    // JSX que representa o formulário
    return (
        <form onSubmit={handleSubmit} className="login-form">
            <div className="form-field">
                <label htmlFor="email">Email</label>
                <input
                    id="email"
                    name="email"
                    type="text"
                    placeholder="michael@jackson.com"
                    required
                />
            </div>
            <div className="form-field">
                <label htmlFor="password">Senha</label>
                <input
                    id="password"
                    name="password"
                    type="password"
                    placeholder="annieru0k2"
                    required
                />
            </div>

            {/* Texto com link para página de registro */}
            <p className="register-text">
                Não possui uma conta?
                <span className="register-link" onClick={navigateRegister}> Registre-se agora</span>
            </p>

            {/* Botão de submissão do formulário */}
            <button className="login-button" type="submit">Login</button>
        </form>
    );
}
