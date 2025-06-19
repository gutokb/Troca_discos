// Importa o CSS específico para estilizar o formulário de registro
import "./RegisterForm.css"

// Importa o hook de navegação para redirecionamento de rotas
import { useNavigate } from "react-router-dom";

// Importa a URL base da API, configurada em outro arquivo
import { API_URL } from "../../config/api.js";

// Componente funcional responsável pelo formulário de cadastro de usuários
export default function RegisterForm() {

    // Hook para redirecionar o usuário após o cadastro
    const navigate = useNavigate();

    /**
     * Função que será chamada quando o formulário for enviado.
     * Responsável por fazer a requisição para cadastrar um novo usuário.
     */
    async function handleSubmit(event) {
        event.preventDefault(); // Evita que o navegador recarregue a página

        // Extrai os dados do formulário e os converte para um objeto
        const formData = new FormData(event.target);
        const registerData = Object.fromEntries(formData); 

        try {
            // Faz uma requisição POST para o endpoint de criação de usuários
            const response = await fetch(`${API_URL}/users`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(registerData)
            });

            const data = await response.json();

            if (response.ok) {
                // Exibe mensagem de sucesso e redireciona para a página inicial
                alert(data.message || "Sucesso no cadastro");
                navigate("/");
            } else {
                // Se o servidor retornar erro, exibe a mensagem
                alert(data.message || "Erro no cadastro");
            }
        } catch (error) {
            // Se houver falha de rede ou erro inesperado
            console.error("Erro de rede:", error);
            alert("Erro ao conectar com o servidor");
        }
    }

    /**
     * JSX que representa o formulário de cadastro.
     * Inclui campos obrigatórios como nome, CPF, email, telefone e senha.
     */
    return (
        <form onSubmit={handleSubmit} className="register-form">

            <div className="form-field">
                <label htmlFor="name">Nome Completo</label>
                <input id="name" name="name" type="text" required/>
            </div>

            <div className="form-field">
                <label htmlFor="cpf">CPF</label>
                <input id="cpf" name="cpf" type="text" required/>
            </div>

            <div className="form-field">
                <label htmlFor="email">Email</label>
                <input id="email" name="email" type="email" required/>
            </div>

            <div className="form-field">
                <label htmlFor="telephone">Telefone</label>
                <input id="telephone" name="telephone" type="tel" required/>
            </div>

            <div className="form-field">
                <label htmlFor="password">Senha</label>
                <input id="password" name="password" type="password" required/>
            </div>

            <div className="form-field">
                <label htmlFor="confirmPassword">Confirme sua senha</label>
                <input id="confirmPassword" name="confirmPassword" type="password" required/>
            </div>

            <button className="register-button" type="submit">Criar conta</button>
        </form>
    );
}
