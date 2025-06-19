
import React, { useEffect, useState } from 'react';
import "./ShoppingCart.css";
import { API_URL } from "../../config/api.js";
import { IoTrash } from 'react-icons/io5';
import "../../services/userService.js"
import { getUserById } from '../../services/userService.js';
import { cartClearRecords, cartRemoveRecord } from '../../services/cartService.js';
import { updateRecord } from '../../services/recordService.js';

export default function ShoppingCart() {
    const [curUser, setCurUser] = useState(JSON.parse(localStorage.getItem("user")).id);
    const [userData, setUserdata] = useState(null);
    const [cart, setCart] =useState([])

    useEffect(() => {
        async function fetchUser() {
            const data = await getUserById(curUser)
            setUserdata(data);
            setCart(data.shoppingCart);
        }
        fetchUser();
    }, [curUser]);

 

    function handleBuy(p){
  
        if(userData?.card_info && userData?.adress){
            p.map(item => {
                const body = {
                    "sold": item.recordId.sold + item.quantity,
                    "stock": item.recordId.stock - 1
                }
                updateRecord(item.recordId._id,body)
            })

            cartClearRecords(curUser);
            setCart([]);
            alert("compra realizada com sucesso")
        }
        else{
            alert("cartão ou endereço ausentes")
        }
    }

    const handleDelete = (productId) => {
        cartRemoveRecord(curUser,productId);
        setCart(cart.filter(item => item.recordId._id != productId))
    };

    if (!userData) return <div className="cart-loading">Carregando...</div>

        console.log(cart)
        let productPrice = cart.reduce((sum, product) => sum + product.recordId.price*product.quantity, 0);
        let frete = 10.00;
        let total = productPrice + frete;

    
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
                            {cart.map(product => (
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
                    <button onClick={()=>handleBuy(cart)} className="checkout-btn">Finalizar Compra</button>
                </div>
            </div>
        </div>
    );
}
