import "./Navbar.css"
import {Link, useNavigate} from "react-router-dom";
import { API_URL } from "../../config/api.js";
import { IoSearchOutline } from "react-icons/io5";
import { useEffect,useState } from "react";

/*
Component for the header/navbar for all pages
 */

// @Params
// loggedIn : boolean, toggles display of login buttons
// handleSearch : function, executed when the search input is submitted, must follow format of action handling in forms
export default function Navbar({handleSearch}) {


    const [userData,setUserData] = useState(null)
    const [logged, SetLogged] = useState(false)
    const [admin, setAdmin] = useState(false)

    async function fetchUser() {
                const userId = ((localStorage.getItem("userId")))
                if(userId != null){
                const response = await fetch(`${API_URL}/users/${userId}`);
                const data = await response.json();
                setUserData(data);
                }
            }

    useEffect(()=>{
        if(userData!=null){
            SetLogged(true);
            if(userData.role == "ADMIN"){
                setAdmin(true);
            }
        }

    },[userData])

    useEffect(()=>{
        fetchUser()
    },[])


    

    

    const navigate = useNavigate();

    function shoppingCartNavigate() {
        // Insert login status checking
        navigate("/shopping-cart");
    }

    function profileNavigate() {
        // Insert login status checking
        navigate("/profile");
    }


    return (
        <header className="app-header">
            <div className="nav-container-1">
                <img onClick={() => navigate("/")} className="img-logo nav-img" src="/src/assets/vynil.png" alt="Logo"/>
                <form action={handleSearch}>
                    <input name="search" className="header-input" type="text" placeholder="Pesquisar"/>
                    <span className="search-icon"><IoSearchOutline/></span>
                </form>
                </div>
            <div className="nav-container-2">
                {admin ? <button onClick={(event) => navigate("/admin")} className="header-button">Admin</button> : null}
                {logged ? null :<button onClick={(event) => navigate("/register")} className="header-button">Cadastro</button>}
                {logged ? null :<button onClick={(event) => navigate("/login")} className="header-button">Login</button>}
                <img onClick={profileNavigate} className="nav-img" src="/src/assets/user.png" alt=""/>
                <img onClick={shoppingCartNavigate} className="nav-img" src="/src/assets/shopping-cart.png" alt=""/>
            </div>
        </header>
    )
}