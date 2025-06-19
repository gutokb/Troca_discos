
import './SearchProduct.css';
import Navbar from "/src/components/Navbar/Navbar.jsx";
import ProductCard from "/src/components/ProductCard/ProductCard.jsx";
import { API_URL } from "../../config/api.js";
import { useParams } from "react-router-dom";
import { useEffect, useState } from 'react';
import * as recordService from '../../services/recordService.js';


export default function SearchProduct() {
    const params = useParams();
    const [products, setProducts] = useState(null);



    useEffect(() => {
        async function fetchProducts() {
            const result = await recordService.getRecordsBySearch(params.query)
            setProducts(result);
            
        }
        fetchProducts();
    }, [params.query]);

    return (
        <>
            <Navbar />
            <main className="search-main">
                <h1>Resultados para "{params.query}"</h1>
                <div className="search-container">
                    {products === null ? (
                        <p>Carregando...</p>
                    ) : (
                       <>
                        {products.map(product => (
                            <ProductCard key={product.id} product={product} />
                        ))
                        }
                        </>
                    )}
                </div>
            </main>
        </>
    );
}
