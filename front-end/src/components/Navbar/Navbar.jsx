import "./Navbar.css" // Importa estilos específicos da navbar
import { Link, useNavigate } from "react-router-dom"; // Importa Link (não usado) e hook de navegação
import { API_URL } from "../../config/api.js"; // Importa URL da API (não usado no código atual)
import { IoSearchOutline } from "react-icons/io5"; // Importa ícone de busca
import { useEffect, useState } from "react"; // Importa hooks React

/*
 Componente Navbar que funciona como cabeçalho para todas as páginas.
 Controla estado de login, busca e navegação.
*/

export default function Navbar() {
    const navigate = useNavigate(); // Hook para navegação programática

    // Estados para controlar se usuário está logado, é admin, nome do usuário e query de busca
    const [loggedIn, setLoggedIn] = useState(false);
    const [isAdmin, setIsAdmin] = useState(false);
    const [userName, setUserName] = useState("");
    const [query, setQuery] = useState(null);

    // Estado para o input da barra de pesquisa
    const [searchInput, setSearchInput] = useState("");

    // Função chamada ao submeter o formulário de busca
    const submitSearch = (e) => {
      e.preventDefault();
      // Navega para a página de busca, passando o termo via query string
      navigate(`/search?q=${encodeURIComponent(searchInput)}`);
      if (handleSearch) handleSearch(searchInput); // Chama função opcional handleSearch, se existir
    };

    // Executado ao montar o componente para verificar se há usuário logado
    useEffect(() => {
        const token = localStorage.getItem("token"); // Busca token no localStorage
        const user = JSON.parse(localStorage.getItem("user")); // Busca usuário no localStorage

        // Se token e usuário existem, define estados para login, admin e nome
        if (token && user) {
            setLoggedIn(true);
            setIsAdmin(user.role === "ADMIN"); // Verifica se usuário é admin
            setUserName(user.name);
        } else {
            // Caso contrário, reseta estados para não logado
            setLoggedIn(false);
            setIsAdmin(false);
            setUserName("");
        }
    }, []);

    // useEffect que escuta mudanças no estado query para navegar para página de produto
    useEffect(() => {
      if (query != null) {
        navigate(`/product/${query.search}`);
      }
    }, [query]);

    // Função que processa o submit do formulário de busca
    function handleSearch(e) {
      e.preventDefault();
      // Pega dados do formulário e converte para objeto
      const formData = new FormData(e.target);
      const newData = Object.fromEntries(formData);
      setQuery(newData); // Atualiza estado query para disparar navegação
      console.log(query); // Log para debug
    }

    // Função para deslogar o usuário
    function handleLogout() {
        // Remove dados de sessão
        localStorage.removeItem("token");
        localStorage.removeItem("user");

        // Atualiza estados para refletir logout
        setLoggedIn(false);
        setIsAdmin(false);
        setUserName("");

        // Redireciona para a página de login
        navigate("/login");
    }

    // Navega para o carrinho de compras
    function shoppingCartNavigate() {
        navigate("/shopping-cart");
    }

    // Navega para a página de perfil
    function profileNavigate() {
        navigate("/profile");
    }


    // JSX do componente navbar
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
            onChange={(e) => setSearchInput(e.target.value)} // Atualiza input controlado
          />
          <span className="search-icon">
            <IoSearchOutline />
          </span>
        </form>
      </div>

      <div className="nav-container-2">
        {/* Botões Cadastro e Login exibidos somente se usuário NÃO está logado */}
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

        {/* Se usuário estiver logado, exibe nome, botão logout */}
        {loggedIn && (
            <>
            <span className="user-name">Olá, {userName}!</span>
            <button onClick={handleLogout} className="header-button">
                Logout
            </button>
            </>
        )}

        {/* Botão Admin aparece só para usuários com role admin */}
        {isAdmin && (
          <button onClick={() => navigate("/admin")} className="header-button">
            Admin
          </button>
        )}

        {/* Ícones clicáveis para perfil e carrinho */}
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
