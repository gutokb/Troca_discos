import React, { useEffect, useState } from 'react';
import "./ShoppingCart.css";
import { API_URL } from "../../config/api.js";
import { IoTrash } from 'react-icons/io5';
// Importação de serviços para buscar usuário, manipular carrinho, atualizar registros e realizar venda
import "../../services/userService.js"
import { getUserById } from '../../services/userService.js';
import { cartClearRecords, cartRemoveRecord } from '../../services/cartService.js';
import { updateRecord } from '../../services/recordService.js';
import { sellCart } from "../../services/salesService.js"

// Componente do carrinho de compras
export default function ShoppingCart() {
    // Estado que armazena o id do usuário atual (pego do localStorage)
    const [curUser, setCurUser] = useState(JSON.parse(localStorage.getItem("user")).id);
    // Estado para armazenar dados completos do usuário obtidos da API
    const [userData, setUserdata] = useState(null);
    // Estado para armazenar os produtos no carrinho do usuário
    const [cart, setCart] =useState([])

    // useEffect para carregar os dados do usuário e seu carrinho assim que o componente monta ou curUser muda
    useEffect(() => {
        async function fetchUser() {
            const data = await getUserById(curUser)  // Busca dados do usuário pela API
            setUserdata(data);                        // Atualiza estado com dados do usuário
            setCart(data.shoppingCart);               // Inicializa carrinho com dados do usuário
        }
        fetchUser();
    }, [curUser]);

    // Função que tenta realizar a compra dos itens no carrinho
    async function handleBuy(p){
        // Verifica se usuário possui cartão e endereço cadastrados antes de finalizar a compra
        if(userData?.card_info && userData?.address){
            const result = await sellCart(userData._id);  // Chama serviço para vender o carrinho
            if (!result?.error){
                alert("compra realizada com sucesso")    // Confirma sucesso
                setCart([]);                             // Limpa carrinho localmente
                // await cartClearRecords(curUser);      // Possível limpeza remota do carrinho (comentado)
            }
            else {
                alert(result.error)                      // Mostra erro caso venda falhe
            }
        }
        else{
            alert("cartão ou endereço ausentes")         // Informa falta de dados obrigatórios
        }
    }

    // Função para remover um produto do carrinho
    const handleDelete = async (productId) => {
        await cartRemoveRecord(curUser,productId);         // Remove registro via serviço
        // Atualiza o estado do carrinho local removendo o item deletado
        setCart(cart.filter(item => item.recordId._id != productId))
    };

    // Exibe mensagem de carregamento enquanto dados do usuário não estiverem disponíveis
    if (!userData) return <div className="cart-loading">Carregando...</div>

    // Debug: imprime o carrinho no console
    console.log(cart)
    // Calcula o total dos preços dos produtos multiplicado pela quantidade
    let productPrice = cart.reduce((sum, product) => sum + product.recordId.price*product.quantity, 0);
    let frete = 10.00;                           // Valor fixo do frete
    let total = productPrice + frete;            // Soma preço dos produtos e frete

    return (
        <div className="cart-page">
            {/* Cabeçalho da página */}
            <div className="page-header">
                <h1 className="page-title">Carrinho de Compras</h1>
            </div>

            <div className="cart-content">
                {/* Tabela que lista os produtos no carrinho */}
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
                                <th></th> {/* Coluna para botão de deletar */}
                            </tr>
                        </thead>
                        <tbody>
                            {cart.map(product => (
                                <tr key={product._id}>
                                    {/* Exibe título do disco */}
                                    <td>{product.recordId.title}</td>
                                    {/* Exibe nome do artista */}
                                    <td>{product.recordId.artist}</td>
                                    {/* Ano de lançamento */}
                                    <td>{product.recordId.year}</td>
                                    {/* Lista os gêneros separados por vírgula */}
                                    <td>{product.recordId.genre.join(", ")}</td>
                                    {/* Preço formatado com duas casas decimais */}
                                    <td>R$ {product.recordId.price.toFixed(2)}</td>
                                    {/* Quantidade comprada, com estilo diferente se estoque zerado */}
                                    <td className={product.recordId.stock === 0 ? 'out-of-stock' : ''}>
                                        {product.quantity}
                                    </td>
                                    {/* Botão para remover o produto do carrinho */}
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

                {/* Resumo do carrinho com preço dos produtos, frete e total */}
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
                    {/* Botão para finalizar a compra */}
                    <button onClick={()=>handleBuy(cart)} className="checkout-btn">Finalizar Compra</button>
                </div>
            </div>
        </div>
    );
}
