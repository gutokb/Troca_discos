import React, {useEffect, useState} from 'react';
import './ProductPage.css';
import { IoSearchOutline, IoAdd, IoCreate, IoTrash, IoEye } from 'react-icons/io5';

export default function ProductPage() {
    const [searchTerm, setSearchTerm] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [modalMode, setModalMode] = useState('create'); // 'create', 'edit', 'view'
    const [selectedProduct, setSelectedProduct] = useState(null);
    // Used for adding/updating genres
    const [currenteGenres, setCurrenteGenres] = useState([]);

    useEffect(() => {
        if (selectedProduct !== null) {
            setCurrenteGenres(selectedProduct.genre)
        }
        else {
            setCurrenteGenres([])
        }
    }, [showModal]);


    // TODO: Replace with actual data from API
    const [products, setProducts] = useState([
        {
            id: 1,
            name: 'Vinyl Classic Rock',
            artist : "artista",
            year : "1990",
            genre: ['Música', "samba"],
            price: 89.90,
            stock: 25,
            status: 'Ativo',
            createdAt: '2024-01-15'
        },
        {
            id: 2,
            name: 'Vintage Jazz Collection',
            artist : "artista",
            year : "1990",
            genre: ['Música', "jazz"],
            price: 124.50,
            stock: 12,
            status: 'Ativo',
            createdAt: '2024-02-20'
        },
        {
            id: 3,
            name: 'Electronic Beats',
            artist : "artista",
            year : "1990",
            genre: ['Música', "jazz"],
            price: 67.90,
            stock: 0,
            status: 'Inativo',
            createdAt: '2024-03-10'
        }
    ]);

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
            // TODO: Implement delete logic with API call
            console.log('Deleting product:', productId);
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        const productData = Object.fromEntries(formData);

        if (modalMode === 'create') {
            // TODO: Implement create product API call
            console.log('Creating product:', productData);
        } else if (modalMode === 'edit') {
            // TODO: Implement update product API call
            console.log('Updating product:', selectedProduct.id, productData);
        }

        setShowModal(false);
    };

    const filteredProducts = products.filter(product =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.genre.some(s => s.toLowerCase().includes(searchTerm.toLowerCase())) ||
        product.artist.toLowerCase().includes(searchTerm.toLowerCase())



    );

    return (
        <div className="product-page">
            <div className="page-header">
                <h1 className="page-title">Gerenciar Produtos</h1>
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
                            <td>{product.name}</td>
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
                                <label>Nome do Produto:</label>
                                <input
                                    type="text"
                                    name="name"
                                    defaultValue={selectedProduct?.name || ''}
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
                                    if (inp.value !== "") setCurrenteGenres([...currenteGenres, inp.value])
                                    inp.value = ""
                                }}><IoAdd/></button>
                            </div>

                            <div className="genre-list">
                                <ul>
                                    {currenteGenres.map((genre, index) => {
                                        return (
                                        <li className="genre-list-item">{genre}
                                            <button className="genre-list-button" type="button" onClick={() => {
                                            if (modalMode ===  "create") setCurrenteGenres(currenteGenres.filter(g => g !== genre))
                                        }}>
                                                {modalMode === "create" && <IoTrash/>}
                                            </button>
                                        </li>)
                                    })}
                                </ul>
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