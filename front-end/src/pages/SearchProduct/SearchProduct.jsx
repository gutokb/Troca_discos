import './SearchProduct.css';
import Navbar from "/src/components/Navbar/Navbar.jsx";
import ProductCard from "/src/components/ProductCard/ProductCard.jsx";
import { API_URL } from "../../config/api.js";
import { useParams } from "react-router-dom";
import { useEffect, useState } from 'react';
import * as recordService from '../../services/recordService.js';

// Componente React que realiza busca e exibe produtos conforme o parâmetro da URL (query)
export default function SearchProduct() {
    const params = useParams(); // Pega os parâmetros da URL (ex: /product/:query)
    const [products, setProducts] = useState(null); // Estado para guardar os produtos buscados

    // useEffect dispara sempre que o parâmetro 'query' muda na URL
    useEffect(() => {
        async function fetchProducts() {
            if(params.query != undefined){
                // Se existir um termo de busca, busca registros filtrados
                const result = await recordService.getRecordsBySearch(params.query);
                setProducts(result);
            } else {
                // Senão, busca todos os registros
                const result = await recordService.getAllRecords();
                setProducts(result);
            }
        }
        fetchProducts();
    }, [params.query]);

    return (
        <>
            <Navbar />
            <main className="search-main">
                {/* Exibe o título da busca só se houver um termo */}
                {params?.query != null ? <h1>Resultados para "{params.query}"</h1> : null}

                <div className="search-container">
                    {/* Enquanto os dados não chegam, mostra 'Carregando...' */}
                    {products === null ? (
                        <p>Carregando...</p>
                    ) : (
                        <>
                            {/* Renderiza um ProductCard para cada produto */}
                            {products.map(product => (
                                <ProductCard key={product.id} product={product} />
                            ))}
                        </>
                    )}
                </div>
            </main>
        </>
    );
}
