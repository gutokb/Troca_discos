// Register.jsx
import "./Register.css"
import Navbar from "../../components/Navbar/Navbar.jsx";
import RegisterForm from "../../components/RegisterForm/RegisterForm.jsx";

export default function Register() {
    return (
        <>
            <Navbar/>
            <main className="register-main-content">
                <div className="register-container">
                    <h1>Informe seus dados</h1>
                    <RegisterForm/>
                </div>
            </main>
        </>
    );
}
