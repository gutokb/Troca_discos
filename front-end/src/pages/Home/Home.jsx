import "./Home.css";
import Navbar from "/src/components/Navbar/Navbar.jsx";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { getAllRecords } from "../../services/recordService.js";
import ProductCard from "/src/components/ProductCard/ProductCard.jsx";

export default function Home() {
    const navigate = useNavigate();
    const [products, setProducts] = useState(null);
    const [mostSold, setMostsold] = useState(null);
    const [recent, setRecent] = useState(null);

    useEffect(() => {
        async function fetchProducts() {
            const response = await getAllRecords();
            setProducts(response);
        }
        fetchProducts();
    }, []);

    useEffect(() => {
        if (products != null) {
            const sortedBySold = [...products].sort((a, b) => b.sold - a.sold).slice(0, 6);
            const sortedByDate = [...products].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).slice(0, 6);
            setMostsold(sortedBySold);
            setRecent(sortedByDate);
        }
    }, [products]);

    return (
        <>
            <Navbar />
            <main className="home-main-content">
                <section className="section">
                    <h1 className="section-title">Mais vendidos</h1>
                    <div className="product-display">
                        {mostSold?.map(product => (
                            <ProductCard key={product._id} product={product} />
                        ))}
                    </div>
                </section>

                <section className="section">
                    <h1 className="section-title">Novas adições</h1>
                    <div className="product-display">
                        {recent?.map(product => (
                            <ProductCard key={product._id} product={product} />
                        ))}
                    </div>
                </section>

                <div className="see-all-container">
                    <button className="see-all-button" onClick={() => navigate('/product/')}>Ver Todos</button>
                </div>
            </main>
        </>
    );
}
