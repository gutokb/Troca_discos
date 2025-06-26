// Importa estilos específicos para a página de login
import "./Login.css";

// Importa componentes reutilizáveis: formulário de login e barra de navegação
import LoginForm from "../../components/LoginForm/LoginForm.jsx";
import Navbar from "../../components/Navbar/Navbar.jsx";

// Componente principal da página de login
// Renderiza a Navbar e o formulário de login centralizado na tela
export default function Login() {
    return (
        <>
            <Navbar />
            <main className="login-main">
                <div className="login-container">
                    <h1>Login</h1>
                    {/* Componente com o formulário para o usuário se autenticar */}
                    <LoginForm />
                </div>
            </main>
        </>
    );
}
