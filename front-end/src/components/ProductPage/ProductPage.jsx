import React, {useEffect, useState} from 'react';
import './ProductPage.css';
import { IoSearchOutline, IoAdd, IoCreate, IoTrash, IoEye } from 'react-icons/io5';
import {API_URL} from "../../config/api.js";
import * as recordService from '../../services/recordService.js';
import * as userService from "../../services/userService.js";
import axios from "axios";

export default function ProductPage() {
    const [searchTerm, setSearchTerm] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [modalMode, setModalMode] = useState('create'); // 'create', 'edit', 'view'
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [products, setProducts] = useState([]);
    const [currentTracks, setCurrentTracks] = useState([]);
    // Controls state of error in operations
    const [error, setError] = useState(false);
    const [errorMessage, setErrorMessage] = useState(null);
    useEffect(() => {
        setError(false);
        setErrorMessage(null);
    }, [showModal]);

    // Data fetching
    // Gambiarra
    const [reload, setReload] = useState(false);
    const forceReload = () => {setReload(!reload);};
    useEffect(() => {
        async function fetchProducts() {
            const data = await recordService.getAllRecords()
            setProducts(data);
        }
        fetchProducts();
    }, [reload])

    // Used for adding/updating genres
    // Logic for displaying and updating genres as a list
    const [currentGenres, setCurrentGenres] = useState([]);
    useEffect(() => {
        if (selectedProduct !== null) {
            setCurrentGenres(selectedProduct.genre)
        }
        else {
            setCurrentGenres([])
        }
    }, [showModal]);

    useEffect(() => {
        if (selectedProduct !== null && selectedProduct.tracks) {
            setCurrentTracks(selectedProduct.tracks);
        } else {
            setCurrentTracks([]);
        }
    }, [showModal]);


    const addTrack = () => {
        const titleInput = document.getElementById("track-title-input");
        const fileInput = document.getElementById("track-file-input");

        if (titleInput.value.trim() !== "" && fileInput.files.length > 0) {
            const newTrack = {
                id: Date.now(), // Simple ID for React key
                title: titleInput.value.trim(),
                file: fileInput.files[0],
                trackNumber: currentTracks.length + 1
            };

            setCurrentTracks([...currentTracks, newTrack]);
            titleInput.value = "";
            fileInput.value = "";
        }
    };

    const removeTrack = (trackId) => {
        const updatedTracks = currentTracks
            .filter(track => track._id !== trackId)
            .map((track, index) => ({
                ...track,
                trackNumber: index + 1
            }));
        setCurrentTracks(updatedTracks);
    };

    const handleSearch = (e) => {
        e.preventDefault();
        // TODO: Implement search logic with API call
        console.log('Searching for:', searchTerm);
    };

    const handleCreate = () => {
        setModalMode('create');
        setSelectedProduct(null);
        setShowModal(true);
    };

    const handleEdit = (product) => {
        setModalMode('edit');
        setSelectedProduct(product);
        setShowModal(true);
    };

    const handleView = (product) => {
        setModalMode('view');
        setSelectedProduct(product);
        setShowModal(true);
    };

    const handleDelete = (productId) => {
        if (window.confirm('Tem certeza que deseja excluir este produto?')) {
            const deleted = recordService.deleteRecord(productId);
            if (deleted?.error) {
                window.alert(deleted.error);
                return;
            }
            setProducts(products.filter(product => product._id !== productId));
        }
    }

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (modalMode === 'create' || modalMode === 'edit') {
            // Create FormData instead of regular object for file uploads
            const formData = new FormData(e.target);

            // Add basic product fields
            const productData = {
                title: formData.get('title'),
                artist: formData.get('artist'),
                year: parseInt(formData.get('year')),
                price: parseFloat(formData.get('price')),
                stock: parseInt(formData.get('stock')),
                coverImgPath: formData.get('cover'),
                genre: currentGenres
            };

            // Add tracks metadata
            const tracksMetadata = currentTracks.map(track => ({
                trackNumber: track.trackNumber,
                title: track.title
            }));

            // Create new FormData for the actual submission
            const submissionFormData = new FormData();

            // Add all product data
            Object.keys(productData).forEach(key => {
                if (key === 'genre') {
                    submissionFormData.append(key, JSON.stringify(productData[key]));
                } else {
                    submissionFormData.append(key, productData[key]);
                }
            });

            // Add tracks metadata
            submissionFormData.append('tracksMetadata', JSON.stringify(tracksMetadata));

            // Add track files
            currentTracks.forEach((track, index) => {
                if (track.file) {
                    submissionFormData.append(`trackFile_${index}`, track.file);
                }
            });

            if (modalMode === 'create') {
                const newProduct = {
                    ...productData,
                    tracks: tracksMetadata // For local state display
                };

                setProducts([...products, newProduct]);

                // Send FormData to backend
                console.log(submissionFormData)
                const url = `${API_URL}/records`;
                fetch(url, {
                    method: 'POST',
                    body: submissionFormData, // Send FormData, not JSON
                }).then(() => forceReload())
                    .catch((err) => {
                    setError(true)
                    setErrorMessage(err.message)
                });

            } else if (modalMode === 'edit') {
                const result = await recordService.updateRecord(selectedProduct._id, productData);
                if (result?.error) {
                    setError(true)
                    setErrorMessage(result.error)
                }
            }
        }
        forceReload()
        setShowModal(false);
    };

    const filteredProducts = products.filter(product =>

        product.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.genre.some(s => s.toLowerCase().includes(searchTerm.toLowerCase())) ||
        product.artist.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="product-page">
            <div className="page-header">
                <h1 className="page-.title">Gerenciar Produtos</h1>
                <button onClick={handleCreate} className="create-btn">
                    <IoAdd /> Novo Produto
                </button>
            </div>

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



                            <div className="genre-list">
                                <ul>
                                    {currentGenres.map((genre, index) => {
                                        return (
                                        <li key={index} className="genre-list-item">{genre}
                                            <button className="genre-list-button" type="button" onClick={() => {
                                            if (modalMode ===  "create") setCurrentGenres(currentGenres.filter(g => g !== genre))
                                        }}>
                                                {modalMode !== "view" && <IoTrash/>}
                                            </button>
                                        </li>)
                                    })}
                                </ul>
                            </div>

                            <div className="form-group">
                                <label>URL da imagem de capa:</label>
                                <input type="text"
                                       name="cover"
                                       defaultValue=""
                                       disabled={modalMode === 'view'}
                                />
                            </div>

                            {modalMode === "create" && <div>

                                {/* Tracklist Section */}
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
                                        <IoAdd/>
                                    </button>
                                </div>

                                <div className="form-group">
                                    <input
                                        id="track-file-input"
                                        type="file"
                                        accept="audio/*"
                                        disabled={modalMode === 'view'}
                                    />
                                </div>

                                {/* Display Current Tracks */}
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
                                                            <IoTrash/>
                                                        </button>
                                                    )}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                )}
                            </div>}

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

                            {error &&
                                <div className="form-group">
                                    <p style={{color : "red"}}>{errorMessage}</p>

                                </div>
                            }

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