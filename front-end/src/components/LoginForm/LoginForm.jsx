// LoginForm.jsx
import { useEffect, useState } from "react";
import { API_URL } from "../../config/api.js";
import "./LoginForm.css"
import {useNavigate} from "react-router-dom";

/*
This is the login form in the center of the login page
 */

export default function LoginForm() {

    const [loginData,setloginData] = useState(null);
    const [userData,setUserData] = useState(null);

    const navigate = useNavigate();

    async function fetchuser(email) {
         const response = await fetch(`${API_URL}/users?email=${email}`);
        const data = await response.json();
        setUserData(data);

    }

    useEffect(()=>{
        if(loginData != null){
        fetchuser(loginData.email)
        }
    },[loginData]);

     useEffect(()=>{
        if(userData!=null){
            if(userData.length === 0){
                alert("Usuário não encontrado")
            }
            else{

                if(userData[0].password === loginData.password){
                    localStorage.setItem("userId",(userData[0].id))
                    navigate("/")
                }
                else{
                    alert("Usuário ou senha incorretos")
                }
            }
        }
    },[userData]);

    function handleSubmit(event) {
        event.preventDefault();
        const formData = new FormData(event.target);
        const receivedLoginData = {
            email: formData.get('email'),
            password: formData.get('password')
        };
        setloginData(receivedLoginData);

        //navigate("/");
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