import React, { useEffect, useState, useRef } from 'react';
import { API_URL } from '../../config/api.js'; // URL base da API (não usado diretamente aqui)
import './ProductDetails.css'; // Estilos específicos para esse componente
import { useNavigate } from 'react-router-dom'; // Para navegação programática
import { getRecordById } from '../../services/recordService.js'; // Serviço para buscar produto por ID
import { getUserById } from '../../services/userService.js'; // Serviço para buscar usuário por ID
import { CartAddRecord, cartSetQuantityRecord } from '../../services/cartService.js'; // Serviços para manipular carrinho
import AudioPlayer from "./AudioPlayer.jsx"; // Componente para tocar áudio da faixa

export default function ProductDetails({ productID }) {
    // Estado para armazenar os dados do produto carregado
    const [productData, setProductData] = useState(null);
    // Estado para armazenar dados do usuário atual (para manipulação do carrinho)
    const [userData, setUserData] = useState(null);
    // Estado para a quantidade de produto a adicionar ao carrinho
    const [cartQuantity, setCartQuantity] = useState(1);
    // Hook para navegação entre páginas
    const navigate = useNavigate();
    // Referência para acessar o input da quantidade diretamente no DOM
    const quantityRef = useRef(null); 

    // useEffect que carrega os dados do produto toda vez que o productID muda
    useEffect(() => {
        async function fetchProduct() {
            const response = await getRecordById(productID); // Busca produto pelo ID
            setProductData(response); // Atualiza estado com os dados do produto

            // Logs para depuração dos arquivos de faixas (tracklist)
            response.tracklist.map(track => { console.log(track.filePath) })
            response.tracklist.map(track => { 
                // Troca barras invertidas por barras normais e extrai nome do arquivo
                console.log(track.filePath.replaceAll("\\", "/").split("/").at(-1)) 
            })
        }
        fetchProduct();
    }, [productID]);

    // useEffect que monitora mudanças no userData e atualiza o carrinho conforme
    useEffect(() => {
        if (userData != null) {
            let newCart = [...userData.shoppingCart]; // Cópia do carrinho do usuário
            let body = ""; // Variável aparentemente não usada
            // Verifica se o produto já está no carrinho do usuário
            if (!(newCart.some(item => {
                return item.recordId._id == String(productID)
            }))) {
                // Se não estiver, adiciona ao carrinho com a quantidade desejada
                CartAddRecord(userData._id, productID, cartQuantity);
            }
            else {
                // Se estiver, atualiza a quantidade do produto no carrinho
                console.log("atualizei")
                cartSetQuantityRecord(userData._id, productID, cartQuantity);
            }

            // Após atualizar o carrinho, navega para a página do carrinho
            navigate("/shopping-cart")
        }
    }, [userData]);

    // Função disparada ao clicar para adicionar ao carrinho
    const handlecart = () => {
        // Atualiza o estado da quantidade com o valor do input (converte para inteiro)
        const quantity = parseInt(quantityRef.current?.value || "1");
        if (quantity < 1){
            window.alert("Quantidade Invalida.")
            return;
        }
        setCartQuantity(quantity);
        
        // Função interna para buscar dados do usuário logado
        async function fetchUser() {
            // Tenta pegar o id do usuário salvo no localStorage
            let userId = JSON.parse(localStorage.getItem("user"))?.id
            if (userId != null) {
                // Se tiver usuário, busca dados completos dele
                const response = await getUserById(userId);
                setUserData(response); // Atualiza estado userData para disparar o useEffect acima
            }
            else {
                // Se não estiver logado, redireciona para página de login
                navigate('/login')
            }
        }
        fetchUser();
    };

    const handleQuantityChange = (event) => {
        const input =  event.target;
        const q = parseInt(input.value, 10)
        if (q < 1 || q > productData.stock) {
            input.value = 1;
        }
    }

    // Se os dados do produto ainda não foram carregados, exibe mensagem de carregamento
    if (!productData) {
        return <div className="product-loading">Carregando...</div>;
    }

    // JSX principal que renderiza os detalhes do produto
    return (
        <div className="product-container">
            {/* Imagem da capa do álbum */}
            <div className="product-image">
                <img src={productData.coverImgPath} alt={productData.title} />
            </div>

            {/* Detalhes do produto */}
            <div className="product-details">
                <h2 className="product-title">{productData.title}</h2>
                <p className="product-artist">{productData.artist}</p>

                {/* Metadados: ano e disponibilidade no estoque */}
                <div className="product-meta">
                    <span>{productData.year}</span>
                    <span className={productData.stock > 0 ? 'in-stock' : 'out-of-stock'}>
                        {productData.stock > 0 ? `${productData.stock} disponíveis` : 'Indisponível'}
                    </span>
                </div>

                {/* Gêneros do álbum exibidos em badges */}
                <div className="product-genres">
                    {productData.genre.map((genre) => (
                        <span key={genre} className="genre-badge">
                            {genre}
                        </span>
                    ))}
                </div>

                {/* Preço formatado */}
                <div className="product-price">
                    R$ {productData.price.toFixed(2)}
                </div>

                {/* Input para o usuário escolher quantidade (limite mínimo 1 e máximo o estoque disponível) */}
                <div className='quantity-input'>
                    <label htmlFor="quantity">Quantidade:</label>
                    <input
                        type='number'
                        name="quantity"
                        max={productData.stock}
                        onChange={handleQuantityChange}
                        min={1}
                        ref={quantityRef} // Referência para pegar valor diretamente no DOM
                        defaultValue={1}
                    />
                </div>

                {/* Botão para adicionar ao carrinho, desabilitado se sem estoque */}
                <div className="product-actions">
                    <button onClick={handlecart} className="cart-btn" disabled={productData.stock <= 0}>
                        {productData.stock > 0 ? 'Adicionar ao carrinho' : 'Esgotado'}
                    </button>
                </div>
            </div>

            {/* Seção que lista as faixas do álbum com player de áudio */}
            <div className="tracklist-container">
                <h3 className="tracklist-title">Faixas</h3>
                <div className="tracklist">
                    {productData.tracklist && productData.tracklist.map((track) => (
                        <div key={track.id} className="track-item">
                            {/* Exibe número e título da faixa */}
                            <p>{`${track.trackNumber}. ${track.title}`}</p>
                            {/* Componente que toca a faixa (nome do arquivo extraído do path) */}
                            <AudioPlayer fileName={track.filePath.replaceAll("\\", "/").split("/").at(-1)} />
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
