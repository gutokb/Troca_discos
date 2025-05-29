import React, { useEffect, useState, useRef } from 'react';
import { API_URL } from '../../config/api.js';
import './ProductDetails.css';
import { useNavigate } from 'react-router-dom';

export default function ProductDetails({ productID }) {
    const [productData, setProductData] = useState(null);
    const [userData, setUserData] = useState(null);
    const [currentTrack, setCurrentTrack] = useState(null);
    const [cartQuantity, setCartQuantity] = useState(1);
    const audioRefs = useRef({});
    const navigate = useNavigate();
    const quantityRef = useRef(null); // Added ref for quantity input

    useEffect(() => {
        async function fetchProduct() {
            const response = await fetch(`${API_URL}/records/${productID}`);
            const data = await response.json();
            setProductData(data);
            
        }
        fetchProduct();
    }, [productID]);

    useEffect(() => {
        if (userData != null) {
            const url = `${API_URL}/users/${userData.id}`;
            let newCart = [...userData.shopping_cart];
            let body = "";
            if (!newCart.some(item=>Number(item.productId) === (Number(productID)))) {
                newCart.push(
                    {"productId": parseInt(productID),
                    "quantity": cartQuantity
                });    
                
            }
            else{
                const index = newCart.findIndex(item=>Number(item.productId) === (Number(productID)));
                console.log(index)
                newCart[index].quantity = newCart[index].quantity + cartQuantity < productData.stock ?
                newCart[index].quantity + cartQuantity : productData.stock ;
        
            }
            console.log(newCart)
            body = JSON.stringify({
                    shopping_cart: newCart,
                });
            fetch(url, {
                    method: 'PATCH',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: body,
                }).catch((err) => console.log(err));
            navigate("/shopping-cart")
        }
    }, [userData]);

    const handlecart = () => {
        setCartQuantity(parseInt(quantityRef.current?.value || "1"))
        async function fetchUser() {
            const response = await fetch(`${API_URL}/users/${JSON.parse(localStorage.getItem("user")).id}`);
            const data = await response.json();
            setUserData(data);
        }
        fetchUser();
    };

    const playTrack = async (track) => {
        try {
            if (currentTrack) {
                const currentAudio = audioRefs.current[currentTrack.id];
                if (currentAudio && !currentAudio.paused) {
                    currentAudio.pause();
                }
            }

            const audio = audioRefs.current[track.id];
            await audio.play();
            setCurrentTrack(track);
        } catch (error) {
            console.error('Playback failed:', error);
        }
    };

    const pauseTrack = () => {
        if (currentTrack) {
            const audio = audioRefs.current[currentTrack.id];
            if (audio) {
                audio.pause();
                setCurrentTrack(null);
            }
        }
    };

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
                    {productData.tracks && productData.tracks.map((track) => (
                        <div key={track.id} className="track-item">
                            <audio
                                ref={el => audioRefs.current[track.id] = el}
                                src={`/audio/track-${track.id}.mp3`}
                                onEnded={() => setCurrentTrack(null)}
                                onError={(e) => console.error(`Error loading track ${track.id}:`, e)}
                            />
                            <button
                                className={`play-btn ${currentTrack?.id === track.id ? 'playing' : ''}`}
                                onClick={() =>
                                    currentTrack?.id === track.id
                                        ? pauseTrack()
                                        : playTrack(track)
                                }
                            >
                                {currentTrack?.id === track.id ? '⏸️' : '▶️'}
                            </button>

                            <div className="track-info">
                                <span className="track-title">{track.title}</span>
                                <span className="track-duration">{track.duration}</span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
