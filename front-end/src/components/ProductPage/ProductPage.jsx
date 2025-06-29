import React, { useEffect, useState } from 'react';
import './ProductPage.css';
import { IoSearchOutline, IoAdd, IoCreate, IoTrash, IoEye } from 'react-icons/io5';
import { API_URL } from "../../config/api.js";
import * as recordService from '../../services/recordService.js';
import * as userService from "../../services/userService.js";
import axios from "axios";

// Componente principal para gerenciar produtos (discos, álbuns)
export default function ProductPage() {
    // Estado para controlar o termo digitado na busca
    const [searchTerm, setSearchTerm] = useState('');
    // Estado para controlar a exibição do modal (formulário para criar/editar/visualizar)
    const [showModal, setShowModal] = useState(false);
    // Modo atual do modal: criar, editar ou visualizar
    const [modalMode, setModalMode] = useState('create');
    // Produto atualmente selecionado para editar/visualizar
    const [selectedProduct, setSelectedProduct] = useState(null);
    // Lista de produtos carregados do backend
    const [products, setProducts] = useState([]);
    // Lista de faixas (tracks) do álbum selecionado
    const [currentTracks, setCurrentTracks] = useState([]);
    // Estados para controle de erros nas operações
    const [error, setError] = useState(false);
    const [errorMessage, setErrorMessage] = useState(null);

    // Limpa erros sempre que o modal abrir ou fechar
    useEffect(() => {
        setError(false);
        setErrorMessage(null);
    }, [showModal]);

    // Estado e função para forçar recarregamento da lista de produtos (gambiarra)
    const [reload, setReload] = useState(false);
    const forceReload = () => { setReload(!reload); };

    // Busca todos os produtos sempre que reload mudar (ou na montagem do componente)
    useEffect(() => {
        async function fetchProducts() {
            const data = await recordService.getAllRecords()
            setProducts(data);
        }
        fetchProducts();
    }, [reload])

    // Estado que controla os gêneros atuais para adicionar/editar
    const [currentGenres, setCurrentGenres] = useState([]);

    // Sempre que modal abrir, atualiza os gêneros para o produto selecionado (ou limpa)
    useEffect(() => {
        if (selectedProduct !== null) {
            setCurrentGenres(selectedProduct.genre)
        } else {
            setCurrentGenres([])
        }
    }, [showModal]);

    // Sempre que modal abrir, atualiza as faixas para o produto selecionado (ou limpa)
    useEffect(() => {
        if (selectedProduct !== null && selectedProduct.tracks) {
            setCurrentTracks(selectedProduct.tracks);
        } else {
            setCurrentTracks([]);
        }
    }, [showModal]);

    // Adiciona uma nova faixa ao álbum
    const addTrack = () => {
        const titleInput = document.getElementById("track-title-input");
        const fileInput = document.getElementById("track-file-input");

        // Verifica se título e arquivo foram preenchidos
        if (titleInput.value.trim() !== "" && fileInput.files.length > 0) {
            const newTrack = {
                id: Date.now(), // ID simples para React key
                title: titleInput.value.trim(),
                file: fileInput.files[0],
                trackNumber: currentTracks.length + 1
            };

            // Atualiza a lista de faixas com a nova faixa
            setCurrentTracks([...currentTracks, newTrack]);

            // Limpa os inputs após adicionar
            titleInput.value = "";
            fileInput.value = "";
        }
    };

    // Remove uma faixa do álbum pelo id e reordena os números das faixas
    const removeTrack = (trackId) => {
        const updatedTracks = currentTracks
            .filter(track => track._id !== trackId)
            .map((track, index) => ({
                ...track,
                trackNumber: index + 1
            }));
        setCurrentTracks(updatedTracks);
    };

    // Função disparada ao submeter o formulário de busca (atualmente só faz log)
    const handleSearch = (e) => {
        e.preventDefault();
        console.log('Searching for:', searchTerm);
    };

    // Abre modal para criação de produto novo
    const handleCreate = () => {
        setModalMode('create');
        setSelectedProduct(null);
        setShowModal(true);
    };

    // Abre modal para editar um produto existente
    const handleEdit = (product) => {
        setModalMode('edit');
        setSelectedProduct(product);
        setShowModal(true);
    };

    // Abre modal para visualizar um produto (modo somente leitura)
    const handleView = (product) => {
        setModalMode('view');
        setSelectedProduct(product);
        setShowModal(true);
    };

    // Função para excluir produto, com confirmação
    const handleDelete = (productId) => {
        if (window.confirm('Tem certeza que deseja excluir este produto?')) {
            const deleted = recordService.deleteRecord(productId);
            if (deleted?.error) {
                window.alert(deleted.error);
                return;
            }
            // Remove da lista local após exclusão
            setProducts(products.filter(product => product._id !== productId));
        }
    }

    // Submete o formulário do modal para criar ou editar produto
    const handleSubmit = async (e) => {
        e.preventDefault();

        if (modalMode === 'create' || modalMode === 'edit') {
            // Cria FormData para envio de arquivos (como faixas)
            const formData = new FormData(e.target);

            // Monta dados básicos do produto
            const productData = {
                title: formData.get('title'),
                artist: formData.get('artist'),
                year: parseInt(formData.get('year')),
                price: parseFloat(formData.get('price')),
                stock: parseInt(formData.get('stock')),
                coverImgPath: formData.get('cover'),
                genre: currentGenres
            };

            // Monta metadados das faixas para envio (sem arquivos)
            const tracksMetadata = currentTracks.map(track => ({
                trackNumber: track.trackNumber,
                title: track.title
            }));

            // Novo FormData para envio real, incluindo arquivos
            const submissionFormData = new FormData();

            // Adiciona todos os dados ao FormData (gênero em JSON)
            Object.keys(productData).forEach(key => {
                if (key === 'genre') {
                    submissionFormData.append(key, JSON.stringify(productData[key]));
                } else {
                    submissionFormData.append(key, productData[key]);
                }
            });

            // Adiciona metadados das faixas
            submissionFormData.append('tracksMetadata', JSON.stringify(tracksMetadata));

            // Adiciona arquivos das faixas
            currentTracks.forEach((track, index) => {
                if (track.file) {
                    submissionFormData.append(`trackFile_${index}`, track.file);
                }
            });

            if (modalMode === 'create') {
                // Atualiza estado local com novo produto para renderizar imediatamente
                const newProduct = {
                    ...productData,
                    tracks: tracksMetadata
                };
                setProducts([...products, newProduct]);

                // Envia ao backend via fetch com método POST
                const url = `${API_URL}/records`;
                fetch(url, {
                    method: 'POST',
                    body: submissionFormData,
                }).then(() => forceReload())
                  .catch((err) => {
                    setError(true)
                    setErrorMessage(err.message)
                });

            } else if (modalMode === 'edit') {
                // Edita produto existente usando serviço
                const result = await recordService.updateRecord(selectedProduct._id, productData);
                if (result?.error) {
                    setError(true)
                    setErrorMessage(result.error)
                }
            }
        }
        // Após submissão, força recarregar a lista e fecha modal
        forceReload()
        setShowModal(false);
    };

    // Filtra produtos pela busca (nome, artista ou gênero)
    const filteredProducts = products.filter(product =>
        product.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.genre.some(s => s.toLowerCase().includes(searchTerm.toLowerCase())) ||
        product.artist.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // JSX da página principal
    return (
        <div className="product-page">
            <div className="page-header">
                <h1 className="page-.title">Gerenciar Produtos</h1>
                <button onClick={handleCreate} className="create-btn">
                    <IoAdd /> Novo Produto
                </button>
            </div>

            {/* Seção de busca */}
            <div className="search-section">
                <form onSubmit={handleSearch} className="search-form">
                    <div className="search-input-container">
                        <input
                            type="text"
                            placeholder="Buscar produtos..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="search-input"
                        />
                        <button type="submit" className="search-btn">
                            <IoSearchOutline />
                        </button>
                    </div>
                </form>
            </div>

            {/* Tabela de produtos */}
            <div className="table-container">
                <table className="products-table">
                    <thead>
                    <tr>
                        <th>ID</th>
                        <th>Nome</th>
                        <th>Artista</th>
                        <th>Lançamento</th>
                        <th>Gênero</th>
                        <th>Preço</th>
                        <th>Estoque</th>
                        <th>Adicionado  em</th>
                        <th>Ações</th>
                    </tr>
                    </thead>
                    <tbody>
                    {filteredProducts.map(product => (
                        <tr key={product._id}>
                            <td>{product._id}</td>
                            <td>{product.title}</td>
                            <td>{product.artist}</td>
                            <td>{product.year}</td>
                            <td>{product.genre.join(", ")}</td>
                            <td>R$ {product.price.toFixed(2)}</td>
                            <td className={product.stock === 0 ? 'out-of-stock' : ''}>
                                {product.stock}
                            </td>
                            <td>{new Date(product.createdAt).toLocaleDateString('pt-BR')}</td>
                            <td>
                                <div className="action-buttons">
                                    {/* Botões para visualizar, editar e excluir */}
                                    <button onClick={() => handleView(product)} className="action-btn view">
                                        <IoEye />
                                    </button>
                                    <button onClick={() => handleEdit(product)} className="action-btn edit">
                                        <IoCreate />
                                    </button>
                                    <button onClick={() => handleDelete(product._id)} className="action-btn delete">
                                        <IoTrash />
                                    </button>
                                </div>
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>

            {/* Modal para criação, edição ou visualização de produto */}
            {showModal && (
                <div className="modal-overlay">
                    <div className="modal">
                        <div className="modal-header">
                            <h2>
                                {modalMode === 'create' && 'Criar Produto'}
                                {modalMode === 'edit' && 'Editar Produto'}
                                {modalMode === 'view' && 'Visualizar Produto'}
                            </h2>
                            <button onClick={() => setShowModal(false)} className="close-btn">&times;</button>
                        </div>

                        <form onSubmit={handleSubmit} className="modal-form">
                            {/* Campos do formulário para título, artista, ano, etc */}
                            <div className="form-group">
                                <label>Titulo do disco:</label>
                                <input
                                    type="text"
                                    name="title"
                                    defaultValue={selectedProduct?.title || ''}
                                    disabled={modalMode === 'view'}
                                    required
                                />
                            </div>

                            <div className="form-group">
                                <label>Artista:</label>
                                <input
                                    type="text"
                                    name="artist"
                                    defaultValue={selectedProduct?.artist || ''}
                                    disabled={modalMode === 'view'}
                                    required
                                />
                            </div>

                            <div className="form-group">
                                <label>Ano:</label>
                                <input
                                    type="text"
                                    name="year"
                                    defaultValue={selectedProduct?.year || ''}
                                    disabled={modalMode === 'view'}
                                    required
                                />
                            </div>

                            {/* Campo para adicionar gêneros dinamicamente */}
                            <div className="form-group form-genre">
                                <label>Genêros:</label>
                                <input id="genre-input"
                                    type="text"
                                    name="genre"
                                    defaultValue=""
                                    disabled={modalMode === 'view'}
                                />
                                <button type="button" disabled={modalMode === 'view'} onClick={(e) => {
                                    let inp = document.getElementById("genre-input")
                                    if (inp.value !== "") setCurrentGenres([...currentGenres, inp.value])
                                    inp.value = ""
                                }}><IoAdd/></button>
                            </div>

                            {/* Lista de gêneros adicionados */}
                            <div className="genre-list">
                                <ul>
                                    {currentGenres.map((genre, index) => {
                                        return (
                                            <li key={index} className="genre-list-item">{genre}
                                                <button className="genre-list-button" type="button" onClick={() => {
                                                    if (modalMode ===  "create") setCurrentGenres(currentGenres.filter(g => g !== genre))
                                                }}>
                                                    {modalMode !== "view" && <IoTrash />}
                                                </button>
                                            </li>
                                        )
                                    })}
                                </ul>
                            </div>

                            {/* URL da imagem da capa */}
                            <div className="form-group">
                                <label>URL da imagem de capa:</label>
                                <input
                                    type="text"
                                    name="cover"
                                    defaultValue={modalMode === "edit" ? selectedProduct?.coverImgPath : ""}
                                    disabled={modalMode === 'view'}
                                />
                            </div>

                            {/* Se estiver no modo criar, exibe seção para adicionar faixas */}
                            {modalMode === "create" && <div>

                                {/* Seção para adicionar faixa */}
                                <div className="form-group form-track">
                                    <label>Adicionar Faixa:</label>
                                    <input
                                        id="track-title-input"
                                        type="text"
                                        placeholder="Título da faixa"
                                        disabled={modalMode === 'view'}
                                    />
                                    <button
                                        type="button"
                                        disabled={modalMode === 'view'}
                                        onClick={addTrack}
                                    >
                                        <IoAdd />
                                    </button>
                                </div>

                                {/* Input para upload de arquivo da faixa */}
                                <div className="form-group">
                                    <input
                                        id="track-file-input"
                                        type="file"
                                        accept="audio/*"
                                        disabled={modalMode === 'view'}
                                    />
                                </div>

                                {/* Lista das faixas adicionadas */}
                                {currentTracks.length > 0 && (
                                    <div className="tracks-list">
                                        <h4>Faixas do Álbum:</h4>
                                        <ul>
                                            {currentTracks.map((track) => (
                                                <li key={track._id} className="track-list-item">
                                                    <span className="track-number">{track.trackNumber}.</span>
                                                    <span className="track-title">{track.title}</span>
                                                    {track.file && (
                                                        <span className="track-file-name">({track.file.name})</span>
                                                    )}
                                                    {modalMode !== "view" && (
                                                        <button
                                                            className="track-list-button"
                                                            type="button"
                                                            onClick={() => removeTrack(track._id)}
                                                        >
                                                            <IoTrash />
                                                        </button>
                                                    )}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                )}
                            </div>}

                            {/* Campos para preço e estoque */}
                            <div className="form-row">
                                <div className="form-group">
                                    <label>Preço:</label>
                                    <input
                                        type="number"
                                        name="price"
                                        step="0.01"
                                        defaultValue={selectedProduct?.price || ''}
                                        disabled={modalMode === 'view'}
                                        required
                                    />
                                </div>

                                <div className="form-group">
                                    <label>Estoque:</label>
                                    <input
                                        type="number"
                                        name="stock"
                                        defaultValue={selectedProduct?.stock || ''}
                                        disabled={modalMode === 'view'}
                                        required
                                    />
                                </div>
                            </div>

                            {/* Exibe mensagem de erro, se houver */}
                            {error && (
                                <div className="form-group">
                                    <p style={{ color: "red" }}>{errorMessage}</p>
                                </div>
                            )}

                            {/* Botões de cancelar e salvar (não aparecem no modo view) */}
                            {modalMode !== 'view' && (
                                <div className="modal-actions">
                                    <button type="button" onClick={() => setShowModal(false)} className="cancel-btn">
                                        Cancelar
                                    </button>
                                    <button type="submit" className="submit-btn">
                                        {modalMode === 'create' ? 'Criar' : 'Salvar'}
                                    </button>
                                </div>
                            )}
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
