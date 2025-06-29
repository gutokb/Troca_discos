import "./Home.css";
import Navbar from "/src/components/Navbar/Navbar.jsx";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { getAllRecords } from "../../services/recordService.js";
import ProductCard from "/src/components/ProductCard/ProductCard.jsx";

// Componente principal da página inicial que exibe os produtos mais vendidos e os mais recentes
export default function Home() {
    const navigate = useNavigate(); // Hook para navegação programada
    const [products, setProducts] = useState(null); // Estado para armazenar todos os produtos
    const [mostSold, setMostsold] = useState(null); // Estado para os produtos mais vendidos
    const [recent, setRecent] = useState(null); // Estado para os produtos adicionados recentemente

    // Carrega todos os produtos quando o componente monta
    useEffect(() => {
        async function fetchProducts() {
            const response = await getAllRecords(); // Busca os registros via serviço
            setProducts(response);
        }
        fetchProducts();
    }, []);

    // Sempre que os produtos mudam, calcula os mais vendidos e os mais recentes
    useEffect(() => {
        if (products != null) {
            // Ordena por quantidade vendida (decrescente) e seleciona os 6 primeiros
            const sortedBySold = [...products].sort((a, b) => b.sold - a.sold).slice(0, 6);
            // Ordena por data de criação (mais recentes primeiro) e seleciona os 6 primeiros
            const sortedByDate = [...products].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).slice(0, 6);
            setMostsold(sortedBySold);
            setRecent(sortedByDate);
        }
    }, [products]);

    return (
        <>
            <Navbar />
            <main className="home-main-content">
                {/* Seção dos produtos mais vendidos */}
                <section className="section">
                    <h1 className="section-title">Mais vendidos</h1>
                    <div className="product-display">
                        {mostSold?.map(product => (
                            <ProductCard key={product._id} product={product} />
                        ))}
                    </div>
                </section>

                {/* Seção dos produtos adicionados recentemente */}
                <section className="section">
                    <h1 className="section-title">Novas adições</h1>
                    <div className="product-display">
                        {recent?.map(product => (
                            <ProductCard key={product._id} product={product} />
                        ))}
                    </div>
                </section>

                {/* Botão para navegar para a página que lista todos os produtos */}
                <div className="see-all-container">
                    <button className="see-all-button" onClick={() => navigate('/product/')}>Ver Todos</button>
                </div>
            </main>
        </>
    );
}
