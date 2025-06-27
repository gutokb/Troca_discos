<<<<<<< Updated upstream
import React, { useEffect, useState } from 'react';
import './UserPage.css';
import { IoSearchOutline, IoAdd, IoCreate, IoTrash, IoEye, IoMail, IoCall } from 'react-icons/io5';
import { API_URL } from "../../config/api.js";
import * as userService from "../../services/userService.js";
import { useParams } from "react-router-dom";

// Componente para gerenciamento completo de usuários:
// listar, buscar, criar, editar, visualizar e deletar usuários
export default function UserPage() {
    // Estado para armazenar o termo da busca (input controlado)
    const [searchTerm, setSearchTerm] = useState('');
    // Controle de exibição do modal (true/false)
    const [showModal, setShowModal] = useState(false);
    // Modo do modal: criação, edição ou visualização
    const [modalMode, setModalMode] = useState('create');
    // Usuário selecionado para edição ou visualização
    const [selectedUser, setSelectedUser] = useState(null);
    // Controle de erros para feedback no modal
    const [error, setError] = useState(false);
    const [errorMessage, setErrorMessage] = useState(null);

    // Limpa mensagens de erro ao abrir/fechar modal
    useEffect(() => {
        setError(false);
        setErrorMessage(null);
    }, [showModal]);

    // Lista de usuários carregada da API
    const [users, setUsers] = useState([]);
    // Estado para forçar recarregamento da lista após operações
    const [reload, setReload] = useState(false);
    const forceReload = () => { setReload(!reload); };

    // Busca os usuários da API toda vez que reload é alterado
    useEffect(() => {
        async function fetchUsers() {
            const data = await userService.getAllUsers();
            setUsers(data);
        }
        fetchUsers();
    }, [reload]);

    // Handler do formulário de busca - atualmente só faz log no console
    const handleSearch = (e) => {
        e.preventDefault();
        console.log('Searching for:', searchTerm);
    };

    // Funções para abrir modal nos modos: criar, editar, visualizar
    const handleCreate = () => {
        setModalMode('create');
        setSelectedUser(null);
        setShowModal(true);
    };
    const handleEdit = (user) => {
        setModalMode('edit');
        setSelectedUser(user);
        setShowModal(true);
    };
    const handleView = (user) => {
        setModalMode('view');
        setSelectedUser(user);
        setShowModal(true);
    };

    // Deleta usuário após confirmação, atualiza lista localmente
    const handleDelete = (userId) => {
        if (window.confirm('Tem certeza que deseja excluir este usuário?')) {
            const deleted = userService.deleteUser(userId);
            if (deleted?.error) {
                window.alert(deleted.error);
                return;
            }
            setUsers(users.filter(user => user._id !== userId));
        }
    };

    // Envia dados do formulário para criar ou editar usuário via API
    const handleSubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        const userData = Object.fromEntries(formData);

        if (modalMode === 'create') {
            const created = await userService.createUser(userData);
            if (created?.error) {
                setError(true);
                setErrorMessage(created.error);
                return;
            }
        } else if (modalMode === 'edit') {
            const updated = await userService.updateUser(selectedUser._id, userData);
            if (updated?.error) {
                setError(true);
                setErrorMessage(updated.error);
                return;
            }
        }
        forceReload();      // Atualiza lista após operação
        setShowModal(false); // Fecha modal
    };

    // Filtra usuários conforme texto digitado no campo de busca (nome, email, função)
    const filteredUsers = users.filter(user =>
        user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.role.toLowerCase().includes(searchTerm.toLowerCase())
    );
=======
// Importações React e CSS
import React, { useEffect, useState } from 'react';
import './StatisticsPage.css';

// Importação de ícones da biblioteca react-icons/io5
import { IoTrendingUp, IoPeople, IoStorefront, IoCard } from 'react-icons/io5';

// Importação dos gráficos reutilizáveis
import MonthlySalesChart from "./charts/MonthlySalesChart.jsx";
import SalesByGenreChart from './charts/SalesByGenreChart.jsx';
import TopArtistsChart from "./charts/TopArtistsChart.jsx";

// Importação do serviço que busca os dados estatísticos da API
import * as statsService from "../../services/statsService.js";


// Componente principal da página de estatísticas (Dashboard Admin)
export default function StatisticsPage() {
    // Estados para armazenar os dados obtidos da API
    const [totalUsers, setTotalUsers] = useState(0); // Número total de usuários cadastrados
    const [totalProducts, setTotalProducts] = useState(0); // Número total de produtos (álbuns)
    const [totalRevenue, setTotalRevenue] = useState(0); // Receita total acumulada
    const [monthlyGrowth, setMontlhyGrowth] = useState(0); // Crescimento percentual do mês
    const [salesPerMonth, setSalesPerMonth] = useState([]); // Vendas agrupadas por mês
    const [salesByGenre, setSalesByGenre] = useState([]); // Vendas agrupadas por gênero
    const [topArtists, setTopArtists] = useState([]); // Artistas mais vendidos

    // Hook useEffect é executado ao montar o componente
    useEffect(() => {
        async function fetchData() {
            // Requisição para o backend através do serviço
            const data = await statsService.getData();
>>>>>>> Stashed changes

            // Atualiza os estados com os dados recebidos
            setTotalUsers(data.totalUsers);
            setTotalProducts(data.totalRecords);
            setTotalRevenue(data.totalEarnings);
            setMontlhyGrowth(data.monthlyGrowth.growthPercentage);
            setSalesPerMonth(data.salesPerMonth);
            setSalesByGenre(data.salesByGenre);
            setTopArtists(data.mostSoldArtists);
        }

        fetchData(); // Chama função de carregamento
    }, []); // Executa apenas uma vez no carregamento

    // JSX da página de estatísticas
    return (
<<<<<<< Updated upstream
        <div className="user-page">
            {/* Cabeçalho da página com título e botão para abrir modal de criação */}
            <div className="page-header">
                <h1 className="page-title">Gerenciar Usuários</h1>
                <button onClick={handleCreate} className="create-btn">
                    <IoAdd /> Novo Usuário
                </button>
            </div>

            {/* Campo de busca com input controlado e botão para buscar */}
            <div className="search-section">
                <form onSubmit={handleSearch} className="search-form">
                    <div className="search-input-container">
                        <input
                            type="text"
                            placeholder="Buscar usuários..."
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

            {/* Tabela que lista usuários filtrados com dados e ações */}
            <div className="table-container">
                <table className="users-table">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Nome</th>
                            <th>Email</th>
                            <th>Telefone</th>
                            <th>Função</th>
                            <th>Cadastrado em</th>
                            <th>Último Login</th>
                            <th>Ações</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredUsers.map(user => (
                            <tr key={user._id}>
                                <td>{user._id}</td>
                                <td>
                                    <div className="user-name">
                                        <strong>{user.name}</strong>
                                    </div>
                                </td>
                                <td>
                                    <div className="contact-info">
                                        <IoMail className="contact-icon" />
                                        {user.email}
                                    </div>
                                </td>
                                <td>
                                    <div className="contact-info">
                                        <IoCall className="contact-icon" />
                                        {user.telephone}
                                    </div>
                                </td>
                                <td>
                                    <span className={`role ${user.role.toLowerCase()}`}>
                                        {user.role}
                                    </span>
                                </td>
                                <td>{new Date(user.createdAt).toLocaleDateString('pt-BR')}</td>
                                <td>{new Date(user.lastLoginAt).toLocaleDateString('pt-BR')}</td>
                                <td>
                                    {/* Botões para visualizar, editar e excluir o usuário */}
                                    <div className="action-buttons">
                                        <button onClick={() => handleView(user)} className="action-btn view">
                                            <IoEye />
                                        </button>
                                        <button onClick={() => handleEdit(user)} className="action-btn edit">
                                            <IoCreate />
                                        </button>
                                        <button onClick={() => handleDelete(user._id)} className="action-btn delete">
                                            <IoTrash />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Modal para criação, edição ou visualização, com formulário adaptado ao modo */}
            {showModal && (
                <div className="modal-overlay">
                    <div className="modal">
                        <div className="modal-header">
                            <h2>
                                {modalMode === 'create' && 'Criar Usuário'}
                                {modalMode === 'edit' && 'Editar Usuário'}
                                {modalMode === 'view' && 'Visualizar Usuário'}
                            </h2>
                            <button onClick={() => setShowModal(false)} className="close-btn">&times;</button>
                        </div>

                        <form onSubmit={handleSubmit} className="modal-form">
                            {/* Campos do formulário - desabilitados no modo visualização */}
                            <div className="form-group">
                                <label>Nome Completo:</label>
                                <input
                                    type="text"
                                    name="name"
                                    defaultValue={selectedUser?.name || ''}
                                    disabled={modalMode === 'view'}
                                    required
                                />
                            </div>

                            <div className="form-group">
                                <label>CPF:</label>
                                <input
                                    type="text"
                                    name="cpf"
                                    defaultValue={selectedUser?.cpf || ''}
                                    disabled={modalMode === 'view'}
                                    required
                                />
                            </div>

                            <div className="form-group">
                                <label>Email:</label>
                                <input
                                    type="email"
                                    name="email"
                                    defaultValue={selectedUser?.email || ''}
                                    disabled={modalMode === 'view'}
                                    required
                                />
                            </div>

                            <div className="form-group">
                                <label>Telefone:</label>
                                <input
                                    type="tel"
                                    name="telephone"
                                    defaultValue={selectedUser?.telephone || ''}
                                    disabled={modalMode === 'view'}
                                    required
                                />
                            </div>

                            <div className="form-row">
                                <div className="form-group">
                                    <label>Função:</label>
                                    <select
                                        name="role"
                                        defaultValue={selectedUser?.role || 'Cliente'}
                                        disabled={modalMode === 'view'}
                                    >
                                        <option value="USER">Cliente</option>
                                        <option value="ADMIN">Admin</option>
                                    </select>
                                </div>
                            </div>

                            {/* Campo senha aparece só no modo criação */}
                            {modalMode === 'create' && (
                                <div className="form-group">
                                    <label>Senha:</label>
                                    <input
                                        type="password"
                                        name="password"
                                        required
                                        minLength="6"
                                    />
                                </div>
                            )}

                            {/* Exibe mensagem de erro se houver */}
                            {error && (
                                <div className="form-group">
                                    <p style={{ color: "red" }}>{errorMessage}</p>
                                </div>
                            )}

                            {/* Botões de cancelar e salvar aparecem apenas nos modos criar e editar */}
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
=======
        <div className="statistics-page">
            <h1 className="page-title">Dashboard - Estatísticas</h1>

            {/* Bloco com os cards principais de estatísticas resumidas */}
            <div className="stats-grid">
                {/* Total de usuários */}
                <div className="stat-card">
                    <div className="stat-icon users">
                        <IoPeople />
                    </div>
                    <div className="stat-info">
                        <h3 className="stat-number">{totalUsers}</h3>
                        <p className="stat-label">Total de Usuários</p>
                    </div>
                </div>

                {/* Total de produtos/álbuns */}
                <div className="stat-card">
                    <div className="stat-icon products">
                        <IoStorefront />
                    </div>
                    <div className="stat-info">
                        <h3 className="stat-number">{totalProducts}</h3>
                        <p className="stat-label">Total de Produtos</p>
                    </div>
                </div>

                {/* Receita acumulada */}
                <div className="stat-card">
                    <div className="stat-icon revenue">
                        <IoCard />
                    </div>
                    <div className="stat-info">
                        <h3 className="stat-number">R$ {totalRevenue}</h3>
                        <p className="stat-label">Receita Total</p>
                    </div>
                </div>

                {/* Crescimento percentual mensal */}
                <div className="stat-card">
                    <div className="stat-icon growth">
                        <IoTrendingUp />
                    </div>
                    <div className="stat-info">
                        <h3 className="stat-number">
                            {`${monthlyGrowth > 0 ? "+" : ""}${monthlyGrowth}`}%
                        </h3>
                        <p className="stat-label">Crescimento Mensal</p>
                    </div>
                </div>
            </div>
>>>>>>> Stashed changes
        </div>
    );
}
