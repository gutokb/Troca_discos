import React, { useEffect, useState } from 'react';
import "./ShoppingCart.css";
import { API_URL } from "../../config/api.js";
import { IoTrash } from 'react-icons/io5';
import { getUserById } from '../../services/userService.js';
import { cartClearRecords, cartRemoveRecord } from '../../services/cartService.js';
import { updateRecord } from '../../services/recordService.js';

export default function ShoppingCart() {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    const [userData, setUserdata] = useState(null);


    useEffect(() => {
        async function fetchUser() {
            if (storedUser?.id) {
                const data = await getUserById(storedUser.id);
                setUserdata(data);
            }
            const data = await getUserById(curUser)
            setUserdata(data);
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
 

    function handleBuy(p){
        let card = userData?.cardNumber
        let address = userData?.address
        if(card != null && address != null){
            p.map(item => {
                const body = {
                    "sold": item.recordId.sold + item.quantity,
                    "stock": item.recordId.stock - 1
                }
                updateRecord(item.recordId._id,body)
            })

            cartClearRecords(curUser);
            alert("compra realizada com sucesso")
        }
        else{
            alert("cartão ou endereço ausentes")
        }
    }

    const handleDelete = (productId) => {
        cartRemoveRecord(curUser,productId);
    };

    if (!userData) return <div className="cart-loading">Carregando...</div>


        const productPrice = userData.shoppingCart.reduce((sum, product) => sum + product.recordId.price*product.quantity, 0);
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
                            {userData.shoppingCart.map(product => (
                                <tr key={product._id}>
                                    <td>{product.recordId.title}</td>
                                    <td>{product.recordId.artist}</td>
                                    <td>{product.recordId.year}</td>
                                    <td>{product.recordId.genre.join(", ")}</td>
                                    <td>R$ {product.recordId.price.toFixed(2)}</td>
                                    <td className={product.recordId.stock === 0 ? 'out-of-stock' : ''}>
                                        {product.quantity}
                                    </td>
                                    <td>
                                        <button
                                            onClick={() => handleDelete(product.recordId._id)}
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
                    <button onClick={()=>handleBuy(userData.shoppingCart)} className="checkout-btn">Finalizar Compra</button>
                </div>
            </div>
        </div>
    );
}
