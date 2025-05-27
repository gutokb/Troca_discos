import React, { useEffect, useState } from 'react';
import { API_URL } from '../../config/api.js';
import './ProductDetails.css';

export default function ProductDetails({ productID }) {
    const [productData, setProductData] = useState(null);

    useEffect(() => {
        async function fetchProduct() {
            const response = await fetch(`${API_URL}/records/${productID}`);
            const data = await response.json();
            setProductData(data);
        }
        fetchProduct();
    }, [productID]);

    if (!productData) {
        return <div className="product-loading">Carregando...</div>;
    }

    return (
        <div className="product-container">
            <div className="product-image">
                <img src={productData.cover} alt={productData.title} />
            </div>

            <div className="product-details">
                <h2 className="product-title">{productData.title}</h2>
                <p className="product-artist">{productData.artist}</p>

                <div className="product-meta">
                    <span>{productData.year}</span>
                    <span className={productData.stock > 0 ? 'in-stock' : 'out-of-stock'}>
                        {productData.stock > 0 ? `${productData.stock} disponíveis` : 'Indisponível'}
                    </span>
                </div>

                <div className="product-genres">
                    {productData.genre.map((genre) => (
                        <span key={genre} className="genre-badge">
                            {genre}
                        </span>
                    ))}
                </div>

                <div className="product-price">
                    R$ {productData.price.toFixed(2)}
                </div>

                <div className="product-actions">
                    <button className="cart-btn" disabled={productData.stock <= 0}>
                        {productData.stock > 0 ? 'Adicionar ao carrinho' : 'Esgotado'}
                    </button>
                </div>
            </div>
        </div>
    );
}
