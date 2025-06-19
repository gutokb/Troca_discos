// Importa os estilos específicos da página Home
import "./Home.css";

// Importa a Navbar (barra de navegação superior)
import Navbar from "/src/components/Navbar/Navbar.jsx";

// Hooks do React para manipulação de estado e efeitos colaterais
import { useEffect, useState } from "react";

// Importa a URL base da API (definida no ambiente)
import { API_URL } from "../../config/api.js";

// Componente que renderiza cada produto individual
import ProductCard from "/src/components/ProductCard/ProductCard.jsx";

// Função que faz a requisição para buscar todos os discos
import { getAllRecords } from "../../services/recordService.js";

// Componente principal da Home
export default function Home() {

    // Estado que armazena todos os produtos retornados da API
    let [products, setProducts] = useState(null);

    // Estado que armazena os produtos mais vendidos
    let [mostSold, setMostsold] = useState(null);

    // Estado que armazena os produtos mais recentes
    let [recent, setRecent] = useState(null);

    // useEffect executado apenas uma vez ao montar o componente
    useEffect(() => {
        async function fetchProducts() {
            // Busca todos os produtos (discos) da API
            const response = await getAllRecords();

            // Armazena os produtos no estado
            setProducts(response);
        }

        fetchProducts();
    }, []);

    // useEffect executado sempre que o estado "products" for atualizado
    useEffect(() => {
        // Evita executar se os produtos ainda não foram carregados
        if (!products) return;

        // Ordena os produtos por quantidade vendida (decrescente) e pega os 6 primeiros
        const sortedBySold = [...products].sort((a, b) => b.sold - a.sold).slice(0, 6);

        // Ordena os produtos por data de criação (mais recentes primeiro) e pega os 6 primeiros
        const sortedByDate = [...products].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).slice(0, 6);

        // Atualiza os estados correspondentes
        setMostsold(sortedBySold);
        setRecent(sortedByDate);
    }, [products]);

    // Renderização da página
    return (
        <>
            {/* Componente da barra de navegação */}
            <Navbar />

            <main className="home-main-content">
                {/* Seção de mais vendidos */}
                <h1 className="mais-vendidos">Mais vendidos</h1>
                <div className="product-display">
                    {
                        // Se os produtos mais vendidos foram carregados, renderiza-os
                        mostSold?.length 
                            ? mostSold.map(product => (
                                <ProductCard key={product._id} product={product} />
                              ))
                            : <p>Carregando...</p> // Caso contrário, mostra mensagem de carregamento
                    }
                </div>

                {/* Seção de novos produtos */}
                <h1 className="mais-vendidos">Novas adições</h1>
                <div className="product-display">
                    {
                        recent === null 
                            ? null // Se ainda não carregou, não mostra nada
                            : recent.map(product => (
                                <ProductCard key={product._id} product={product} />
                              ))
                    }
                </div>
            </main>
        </>
    );
}
