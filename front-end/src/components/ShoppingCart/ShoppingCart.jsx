import React, { useEffect, useState } from 'react';
import "./ShoppingCart.css";
import { API_URL } from "../../config/api.js";
import { IoTrash } from 'react-icons/io5';

export default function ShoppingCart() {
    const [curUser, setCurUser] = useState(JSON.parse(localStorage.getItem("user")).id);
    const [userData, setUserdata] = useState(null);
    const [products, setProducts] = useState([]);

    useEffect(() => {
        async function fetchUser() {
            const response = await fetch(`${API_URL}/users/${curUser}`);
            const data = await response.json();
            setUserdata(data);
        }
        fetchUser();
    }, [curUser]);

    useEffect(() => {
        async function fetchProducts() {
            const response = await fetch(`${API_URL}/records`);
            const data = await response.json();
            setProducts(data);
        }
        fetchProducts();
    }, [userData]);

    const handleDelete = (productId) => {
        setProducts(products.filter(product => product.id !== productId));
        const url = `${API_URL}/users/${curUser}`;
        const body = JSON.stringify({
            shopping_cart: userData.shopping_cart.filter(item => Number(item.productId) !== Number(productId))
        });
        fetch(url, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
            },
            body: body,
        }).catch((err) => console.log(err));
    };

    if (!userData) return <div className="cart-loading">Carregando...</div>;

    let filteredProducts = products.filter(product =>
        userData.shopping_cart.some(item => Number(item.productId) == Number(product.id))
    );

    filteredProducts = userData.shopping_cart.map(cartItem => {
    const product = filteredProducts.find(record => Number(record.id) === Number(cartItem.productId));
    if (!product) return null;

    return {
        ...product,
        quantity: cartItem.quantity
    };
    }).filter(Boolean);

    console.log(userData)

    const productPrice = filteredProducts.reduce((sum, product) => sum + product.price, 0);
    const frete = 10.00;
    const total = productPrice + frete;

    return (
        <div className="cart-page">
            <div className="page-header">
                <h1 className="page-title">Carrinho de Compras</h1>
            </div>

            <div className="cart-content">
                <div className="table-container">
                    <table className="cart-table">
                        <thead>
                            <tr>    
                                <th>Nome</th>
                                <th>Artista</th>
                                <th>Lançamento</th>
                                <th>Gênero</th>
                                <th>Preço</th>
                                <th>Quantidade</th>
                                <th></th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredProducts.map(product => (
                                <tr key={product.id}>
                                    <td>{product.title}</td>
                                    <td>{product.artist}</td>
                                    <td>{product.year}</td>
                                    <td>{product.genre.join(", ")}</td>
                                    <td>R$ {product.price.toFixed(2)}</td>
                                    <td /*className={product.stock === 0 ? 'out-of-stock' : ''}*/>
                                        {product.quantity}
                                    </td>
                                    <td>
                                        <button
                                            onClick={() => handleDelete(product.id)}
                                            className="action-btn delete"
                                        >
                                            <IoTrash />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                <div className="cart-summary">
                    <div className="summary-item">
                        <span>Produtos:</span>
                        <span>R$ {productPrice.toFixed(2)}</span>
                    </div>
                    <div className="summary-item">
                        <span>Frete:</span>
                        <span>R$ {frete.toFixed(2)}</span>
                    </div>
                    <hr />
                    <div className="summary-item total">
                        <span>Total:</span>
                        <span>R$ {total.toFixed(2)}</span>
                    </div>
                    <button className="checkout-btn">Finalizar Compra</button>
                </div>
            </div>
        </div>
    );
}
