import "./Navbar.css"
import {Link, useNavigate} from "react-router-dom";
import { IoSearchOutline } from "react-icons/io5";

/*
Component for the header/navbar for all pages
 */

// @Params
// loggedIn : boolean, toggles display of login buttons
// handleSearch : function, executed when the search input is submitted, must follow format of action handling in forms
export default function Navbar({handleSearch}) {

    // Requires auth logic
    let admin = true;

    // Requires auth logic
    let loggedIn = false;

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
                {loggedIn ? null :<button onClick={(event) => navigate("/register")} className="header-button">Cadastro</button>}
                {loggedIn ? null :<button onClick={(event) => navigate("/login")} className="header-button">Login</button>}
                <img onClick={shoppingCartNavigate} className="nav-img" src="/src/assets/user.png" alt=""/>
                <img onClick={profileNavigate} className="nav-img" src="/src/assets/shopping-cart.png" alt=""/>
            </div>
        </header>
    )
}