import React, {useEffect, useState} from 'react';
import './ProductPage.css';
import { IoSearchOutline, IoAdd, IoCreate, IoTrash, IoEye } from 'react-icons/io5';
import {API_URL} from "../../config/api.js";

export default function ProductPage() {
    const [searchTerm, setSearchTerm] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [modalMode, setModalMode] = useState('create'); // 'create', 'edit', 'view'
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [products, setProducts] = useState([]);


    // Data fetching
    // Gambiarra
    const [reload, setReload] = useState(false);
    const forceReload = () => {setReload(!reload);};
    useEffect(() => {
        async function fetchProducts() {
            const response =  await fetch(`${API_URL}/records`);
            const data = await response.json();
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

    // Used for adding/updating tracks
    const [currentTracks, setCurrentTracks] = useState([]);
    useEffect(() => {
        if (selectedProduct !== null) {
            setCurrentTracks(selectedProduct.tracks)
        }
        else {
            setCurrentTracks([])
        }
    }, [showModal]);


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
            setProducts(products.filter(product => product.id !== productId));
            const url = `${API_URL}/records/${productId}`;
            fetch(url, {
                method: 'DELETE',

            }).catch((err) => console.log(err));
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        const productData = Object.fromEntries(formData);

        if (modalMode === 'create') {
            const newProduct = {
                ...productData,
                id : Math.floor(Math.random() * 100).toString(),
                createdAt: new Date(),
            };
            newProduct.genre = currentGenres;
            newProduct.price = parseFloat(newProduct.price)
            newProduct.stock = parseInt(newProduct.stock)
            newProduct.year = parseInt(newProduct.year)
            const url = `${API_URL}/records`;

            const body = JSON.stringify(newProduct);
            setProducts([...products, newProduct]);
            fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: body,
            }).catch((err) => console.log(err));

        } else if (modalMode === 'edit') {
            const url = `${API_URL}/records/${selectedProduct.id}`;
            productData.genre = currentGenres;
            productData.price = parseFloat(productData.price)
            productData.stock = parseInt(productData.stock)
            productData.year = parseInt(productData.year)
            const body = JSON.stringify(productData);
            fetch(url, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: body,
            }).catch((err) => console.log(err));
            forceReload()
        }

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
                        <tr key={product.id}>
                            <td>{product.id}</td>
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
                                    <button onClick={() => handleDelete(product.id)} className="action-btn delete">
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