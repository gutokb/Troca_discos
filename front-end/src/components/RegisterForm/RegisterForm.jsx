// RegisterForm.jsx
import "./RegisterForm.css"
import {useNavigate} from "react-router-dom";


// TODO : error detecting and displaying

export default function RegisterForm() {

    const navigate = useNavigate();

    // Requires registering logic
    async function handleSubmit(event) {
        event.preventDefault();
        const formData = new FormData(event.target);
        const registerData = Object.fromEntries(formData); 
   
        try {
            const response = await fetch("http://localhost:3001/register", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(registerData)
            });

            const data = await response.json();

            if (response.ok) {
                //volta para a pagina inicial
                alert(data.message || "Sucesso no cadastro");
                navigate("/");

            } else {
                alert(data.message || "Erro no cadastro");
            }
        } catch (error) {
            console.error("Erro de rede:", error);
            alert("Erro ao conectar com o servidor");
        }
     }

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