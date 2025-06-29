// Importa o componente do carrinho de compras e a barra de navegação
import ShoppingCart from "../../components/ShoppingCart/ShoppingCart.jsx";
import Navbar from "/src/components/Navbar/Navbar.jsx";

// Importa a URL base da API e o CSS específico da página do carrinho
import { API_URL } from "../../config/api.js";
import "./Cart.css";

// Componente que representa a página do carrinho de compras
// Exibe a Navbar no topo e o componente ShoppingCart dentro do conteúdo principal
export default function Cart() {
    return (
        <>
            <Navbar />
            <main className="cart-main">
                <div className="cart-container">
                    {/* Componente que gerencia e exibe os itens do carrinho */}
                    <ShoppingCart />
                </div>
            </main>
        </>
    );
}
