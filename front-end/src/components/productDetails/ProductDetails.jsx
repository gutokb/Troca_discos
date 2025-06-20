import React, { useEffect, useState, useRef } from 'react';
import { API_URL } from '../../config/api.js';
import './ProductDetails.css';
import { useNavigate } from 'react-router-dom';
import { getRecordById } from '../../services/recordService.js';
import { getUserById } from '../../services/userService.js';
import { CartAddRecord, cartSetQuantityRecord } from '../../services/cartService.js';
import AudioPlayer from "./AudioPlayer.jsx";

export default function ProductDetails({ productID }) {
    const [productData, setProductData] = useState(null);
    const [userData, setUserData] = useState(null);
    const [cartQuantity, setCartQuantity] = useState(1);
    const navigate = useNavigate();
    const quantityRef = useRef(null); 

    useEffect(() => {
        async function fetchProduct() {
            const response = await getRecordById(productID);
            setProductData(response);
            
        }
        fetchProduct();
    }, [productID]);

    useEffect(() => {
        if (userData != null) {
            let newCart = [...userData.shoppingCart];
            let body = "";
            if (!(newCart.some(item=>{
                return item.recordId._id == String(productID)}))) {
                CartAddRecord(userData._id,productID,cartQuantity);
            }
            else{
                console.log("atualizei")
                cartSetQuantityRecord(userData._id,productID,cartQuantity);
            }
           
            navigate("/shopping-cart")
        }
    }, [userData]);

    const handlecart = () => {
        setCartQuantity(parseInt(quantityRef.current?.value || "1"))
        async function fetchUser() {
            let userId = JSON.parse(localStorage.getItem("user"))?.id
            if(userId!=null){
            const response = await getUserById(userId);
            setUserData(response);
            }
            else{
                navigate('/login')
            }
        }
        fetchUser();
    };



    if (!productData) {
        return <div className="product-loading">Carregando...</div>;
    }

    return (
        <div className="product-container">
            <div className="product-image">
                <img src={productData.coverImgPath} alt={productData.title} />
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

                <div className='quantity-input'>
                    <label htmlFor="quantity">Quantidade:</label>
                    <input
                        type='number'
                        name="quantity"
                        max={productData.stock}
                        min = {1}
                        ref={quantityRef} // Attach the ref
                        defaultValue={1}
                    />
                </div>

                <div className="product-actions">
                    <button onClick={handlecart} className="cart-btn" disabled={productData.stock <= 0}>
                        {productData.stock > 0 ? 'Adicionar ao carrinho' : 'Esgotado'}
                    </button>
                </div>
            </div>

            {/* Audio Tracklist Section */}
            <div className="tracklist-container">
                <h3 className="tracklist-title">Faixas</h3>
                <div className="tracklist">
                    {productData.tracklist && productData.tracklist.map((track) => (
                        <div key={track.id} className="track-item">
                            <p>{`${track.trackNumber}. ${track.title}`}</p>
                            <AudioPlayer fileName={track.filePath.split("/").at(-1)} />
                        </div>))
                    }
                </div>
            </div>
        </div>
    );
}
