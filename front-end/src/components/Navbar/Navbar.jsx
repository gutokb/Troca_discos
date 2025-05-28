import "./Navbar.css"
import {Link, useNavigate} from "react-router-dom";
import { API_URL } from "../../config/api.js";
import { IoSearchOutline } from "react-icons/io5";
import { useEffect, useState } from "react";

/*
Component for the header/navbar for all pages
 */

// @Params
// loggedIn : boolean, toggles display of login buttons
// handleSearch : function, executed when the search input is submitted, must follow format of action handling in forms
export default function Navbar() {
    const navigate = useNavigate();

    // Estados para controlar se o usuário está logado e se é admin
    const [loggedIn, setLoggedIn] = useState(false);
    const [isAdmin, setIsAdmin] = useState(false);
    const [userName, setUserName] = useState("");
    const [query, setQuery] = useState(null);

    // Estado que guarda o termo pesquisado na barra de pesquisa
    const [searchInput, setSearchInput] = useState("");

    // função que lida com a pesquisa
    const submitSearch = (e) => {
      e.preventDefault();
      // Redireciona para a página de busca
      navigate(`/search?q=${encodeURIComponent(searchInput)}`);
      if (handleSearch) handleSearch(searchInput); // opcional
    };

    // useEffect é executado ao carregar o componente
    useEffect(() => {
        const token = localStorage.getItem("token");
        const user = JSON.parse(localStorage.getItem("user"));

        // Se houver token e usuário, considera que está logado
        if (token && user) {
            setLoggedIn(true);
            setIsAdmin(user.role === "admin"); // Define se é admin
            setUserName(user.name);
        } else {
            setLoggedIn(false);
            setIsAdmin(false);
            setUserName("");
        }
    }, []);
    
    useEffect(()=>{
      if(query!=null){
        navigate(`/product/${query.search}`)
      }
    },[query])

    function handleSearch(e){
      e.preventDefault()
        const formData = new FormData(e.target);
        const newData = Object.fromEntries(formData);
        setQuery(newData);
        console.log(query)
    }

    // Lógica do botão de logout
    function handleLogout() {
        // Remove os dados da sessão
        localStorage.removeItem("token");
        localStorage.removeItem("user");

        // Atualiza os estados
        setLoggedIn(false);
        setIsAdmin(false);
        setUserName("");

        // Redireciona para a página de login
        navigate("/login");
    }

    // Redireciona para o carrinho
    function shoppingCartNavigate() {
        navigate("/shopping-cart");
    }

    // Redireciona para o perfil
    function profileNavigate() {
        navigate("/profile");
    }


    return (
    <header className="app-header">
      <div className="nav-container-1">
        {/* Logo clicável que redireciona para a home */}
        <img
          onClick={() => navigate("/")}
          className="img-logo nav-img"
          src="/src/assets/vynil.png"
          alt="Logo"
        />

        {/* Formulário de busca */}
        <form onSubmit={handleSearch}>
          <input
            name="search"
            className="header-input"
            type="text"
            placeholder="Pesquisar"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
          />
          <span className="search-icon">
            <IoSearchOutline />
          </span>
        </form>
      </div>

      <div className="nav-container-2">
        {/* Botão Admin aparece só se for admin */}
        {isAdmin && (
          <button onClick={() => navigate("/admin")} className="header-button">
            Admin
          </button>
        )}

        {/* Botões "Cadastro" e "Login" só aparecem se NÃO estiver logado */}
        {!loggedIn && (
          <>
            <button onClick={() => navigate("/register")} className="header-button">
              Cadastro
            </button>
            <button onClick={() => navigate("/login")} className="header-button">
              Login
            </button>
          </>
        )}

        {/* Botão de Logout aparece somente se estiver logado */}
        {loggedIn && (
            <>
            <span className="user-name">Olá, {userName}!</span>
            <button onClick={handleLogout} className="header-button">
                Logout
            </button>
            </>
        )}

        {/* Ícones de perfil e carrinho, clicáveis */}
        <img
          onClick={profileNavigate}
          className="nav-img"
          src="/src/assets/user.png"
          alt="Perfil"
        />
        <img
          onClick={shoppingCartNavigate}
          className="nav-img"
          src="/src/assets/shopping-cart.png"
          alt="Carrinho"
        />
      </div>
    </header>
  );
}