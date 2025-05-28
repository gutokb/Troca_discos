
import './SearchProduct.css';
import Navbar from "/src/components/Navbar/Navbar.jsx";
import ProductCard from "/src/components/ProductCard/ProductCard.jsx";
import { API_URL } from "../../config/api.js";
import { useParams } from "react-router-dom";
import { useEffect, useState } from 'react';

export default function SearchProduct() {
    const params = useParams();
    const [products, setProducts] = useState(null);

    useEffect(() => {
        async function fetchProducts() {
            const [res1, res2, res3] = await Promise.all([
                fetch(`${API_URL}/records?title_like=${params.query}`),
                fetch(`${API_URL}/records?genre_like=${params.query}`),
                fetch(`${API_URL}/records?artist_like=${params.query}`)
            ]);
            const [data1, data2, data3] = await Promise.all([res1.json(), res2.json(), res3.json()]);
            const combined = [...data1, ...data2, ...data3];
            setProducts(combined);
        }
        fetchProducts();
    }, [params.query]);

    return (
        <>
            <Navbar />
            <main className="search-main">
                <div className="search-container">
                    {products === null ? (
                        <p>Carregando...</p>
                    ) : (
                        products.map(product => (
                            <ProductCard key={product.id} product={product} />
                        ))
                    )}
                </div>
            </main>
        </>
    );
}
