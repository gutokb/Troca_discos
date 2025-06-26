import React, { useEffect, useState } from 'react';
import './UserPage.css';
import { IoSearchOutline, IoAdd, IoCreate, IoTrash, IoEye, IoMail, IoCall } from 'react-icons/io5';
import { API_URL } from "../../config/api.js";
import * as userService from "../../services/userService.js";
import { useParams } from "react-router-dom";

// Componente para gerenciar usuários: listar, buscar, criar, editar, visualizar e deletar
export default function UserPage() {
    // Estado para armazenar o texto digitado no campo de busca
    const [searchTerm, setSearchTerm] = useState('');
    // Controle se o modal está visível ou não
    const [showModal, setShowModal] = useState(false);
    // Define o modo do modal: criação, edição ou visualização
    const [modalMode, setModalMode] = useState('create');
    // Usuário selecionado para edição ou visualização
    const [selectedUser, setSelectedUser] = useState(null);
    // Estado para controle de erros no modal
    const [error, setError] = useState(false);
    const [errorMessage, setErrorMessage] = useState(null);

    // Limpa mensagens de erro sempre que o modal é aberto ou fechado
    useEffect(() => {
        setError(false);
        setErrorMessage(null);
    }, [showModal]);

    // Lista dos usuários carregada da API
    const [users, setUsers] = useState([]);
    // Estado para forçar recarregamento da lista (troca de valor força reexecução)
    const [reload, setReload] = useState(false);
    const forceReload = () => { setReload(!reload); };

    // Busca a lista de usuários do backend sempre que 'reload' mudar
    useEffect(() => {
        async function fetchUsers() {
            const data = await userService.getAllUsers();
            setUsers(data);
        }
        fetchUsers();
    }, [reload]);

    // Handler do formulário de busca — por enquanto só imprime no console
    const handleSearch = (e) => {
        e.preventDefault();
        console.log('Searching for:', searchTerm);
    };

    // Função para abrir o modal no modo criação
    const handleCreate = () => {
        setModalMode('create');
        setSelectedUser(null);
        setShowModal(true);
    };
    // Função para abrir o modal no modo edição, carregando usuário selecionado
    const handleEdit = (user) => {
        setModalMode('edit');
        setSelectedUser(user);
        setShowModal(true);
    };
    // Função para abrir o modal no modo visualização, carregando usuário selecionado
    const handleView = (user) => {
        setModalMode('view');
        setSelectedUser(user);
        setShowModal(true);
    };

    // Função para deletar usuário após confirmação do usuário
    const handleDelete = (userId) => {
        if (window.confirm('Tem certeza que deseja excluir este usuário?')) {
            const deleted = userService.deleteUser(userId);
            if (deleted?.error) {
                window.alert(deleted.error);
                return;
            }
            // Remove o usuário deletado da lista local para atualização imediata
            setUsers(users.filter(user => user._id !== userId));
        }
    };

    // Handler do envio do formulário de criação/edição
    const handleSubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        const userData = Object.fromEntries(formData);

        // Cria ou atualiza usuário via API conforme modo do modal
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
        // Força recarregamento da lista para refletir alterações
        forceReload();
        // Fecha o modal após submissão bem-sucedida
        setShowModal(false);
    };

    // Filtra os usuários para exibir conforme termo digitado na busca
    const filteredUsers = users.filter(user =>
        user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.role.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="user-page">
            {/* Cabeçalho com título e botão para criar novo usuário */}
            <div className="page-header">
                <h1 className="page-title">Gerenciar Usuários</h1>
                <button onClick={handleCreate} className="create-btn">
                    <IoAdd /> Novo Usuário
                </button>
            </div>

            {/* Seção de busca com input controlado */}
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

            {/* Tabela exibindo usuários filtrados */}
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
                                    {/* Botões para visualizar, editar e deletar o usuário */}
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

            {/* Modal para criação, edição ou visualização */}
            {showModal && (
                <div className="modal-overlay">
                    <div className="modal">
                        <div className="modal-header">
                            <h2>
                                {modalMode === 'create' && 'Criar Usuário'}
                                {modalMode === 'edit' && 'Editar Usuário'}
                                {modalMode === 'view' && 'Visualizar Usuário'}
                            </h2>
                            {/* Botão para fechar o modal */}
                            <button onClick={() => setShowModal(false)} className="close-btn">&times;</button>
                        </div>

                        {/* Formulário que adapta campos e habilitação conforme modo */}
                        <form onSubmit={handleSubmit} className="modal-form">
                            {/* Nome Completo */}
                            <div className="form-group">
                                <label>Nome Completo:</label>
                                <input
                                    type="text"
                                    name="name"
                                    defaultValue={selectedUser?.name || ''}
                                    disabled={modalMode === 'view'} // desabilita no modo visualização
                                    required
                                />
                            </div>

                            {/* CPF */}
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

                            {/* Email */}
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

                            {/* Telefone */}
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

                            {/* Função (select) */}
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

                            {/* Campo senha só aparece no modo criação */}
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

                            {/* Exibe mensagem de erro, se houver */}
                            {error && (
                                <div className="form-group">
                                    <p style={{ color: "red" }}>{errorMessage}</p>
                                </div>
                            )}

                            {/* Botões para cancelar e salvar, apenas nos modos criar e editar */}
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
