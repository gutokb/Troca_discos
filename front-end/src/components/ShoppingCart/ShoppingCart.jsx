import React, { useEffect, useState } from 'react';
import "./ShoppingCart.css";
import { API_URL } from "../../config/api.js";
import { IoTrash } from 'react-icons/io5';
import { getUserById } from '../../services/userService.js';

export default function ShoppingCart() {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    const [userData, setUserdata] = useState(null);
    const [products, setProducts] = useState([]);
    const [cart, setCart] = useState([]);

    useEffect(() => {
        async function fetchUser() {
            if (storedUser?.id) {
                const data = await getUserById(storedUser.id);
                setUserdata(data);
            }
        }
        fetchUser();
    }, [storedUser]);

    useEffect(() => {
        async function fetchProducts() {
            const response = await fetch(`${API_URL}/records`);
            const data = await response.json();
            setProducts(data);
            if(userData && userData.shopping_cart){
                setCart(userData.shopping_cart);
            }
        }
        fetchProducts();
    }, [userData]);

    function handleBuy(items) {
        let card = userData?.card_info?.number;
        let address = userData?.address;
        if (card && address) {
            items.forEach(item => {
                const url = `${API_URL}/records/${item.id}`;
                const body = JSON.stringify({
                    sold: item.sold + item.quantity,
                    stock: item.stock - item.quantity
                });
                fetch(url, {
                    method: 'PATCH',
                    headers: { 'Content-Type': 'application/json' },
                    body: body,
                }).catch(err => console.log(err));
            });

            const uurl = `${API_URL}/users/${storedUser.id}`;
            const ubody = JSON.stringify({ shopping_cart: [] });
            fetch(uurl, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: ubody,
            }).catch(err => console.log(err));

            setCart([]);
            alert("Compra realizada com sucesso!");
        } else {
            alert("Cartão ou endereço ausentes");
        }
    }

    const handleDelete = (productId) => {
        const updatedCart = cart.filter(item => Number(item.productId) !== Number(productId));
        setCart(updatedCart);

        const url = `${API_URL}/users/${storedUser.id}`;
        const body = JSON.stringify({ shopping_cart: updatedCart });
        fetch(url, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: body,
        }).catch(err => console.log(err));
    };

    if (!userData || !Array.isArray(cart)) return <div className="cart-loading">Carregando...</div>;

    const filteredProducts = cart.map(cartItem => {
        const product = products.find(record => Number(record.id) === Number(cartItem.productId));
        if (!product) return null;
        return { ...product, quantity: cartItem.quantity };
    }).filter(Boolean);

    const productPrice = filteredProducts.reduce((sum, product) => sum + product.price * product.quantity, 0);
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
                                    <td>{product.quantity}</td>
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
                    <button onClick={() => handleBuy(filteredProducts)} className="checkout-btn">
                        Finalizar Compra
                    </button>
                </div>
            </div>
        </div>
    );
}
