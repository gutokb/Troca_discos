// Importa estilos específicos para a página de registro
import "./Register.css";

// Importa componentes reutilizáveis: barra de navegação e formulário de cadastro
import Navbar from "../../components/Navbar/Navbar.jsx";
import RegisterForm from "../../components/RegisterForm/RegisterForm.jsx";

// Componente principal da página de registro de usuário
// Renderiza a Navbar no topo e um formulário de cadastro centralizado
export default function Register() {
    return (
        <>
            <Navbar />
            <main className="register-main-content">
                <div className="register-container">
                    <h1>Informe seus dados</h1>
                    {/* Componente com o formulário de cadastro */}
                    <RegisterForm />
                </div>
            </main>
        </>
    );
}

