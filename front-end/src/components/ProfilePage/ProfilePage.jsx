import React, { useEffect, useState } from 'react';
import { API_URL } from "../../config/api.js";
import { useNavigate } from "react-router-dom";
import './ProfilePage.css'
import * as userService from "../../services/userService.js";

// Componente da página de perfil do usuário, que permite visualizar, editar dados e excluir conta
export default function ProfilePage() {
    // Estado para armazenar o ID do usuário atual (extraído do localStorage)
    const [curUser, setCurUser] = useState(JSON.parse(localStorage.getItem("user")).id);
    // Estado para armazenar os dados completos do usuário (objeto)
    const [userData, setUserdata] = useState(null);
    // Estado que controla o modo da página: "view" para visualização e "edit" para edição
    const [curMode, setMode] = useState("view");
    // Hook para navegação programática
    const navigate = useNavigate();

    // Ao montar o componente ou mudar o curUser, busca os dados atualizados do usuário na API
    useEffect(() => {
        async function fetchUser() {
            const data = await userService.getUserById(curUser);
            setUserdata(data); // atualiza o estado com os dados do usuário
        }
        fetchUser();
    }, [curUser]);

    // Função para tratar o envio do formulário de edição
    async function handleSubmit(e) {
        e.preventDefault();

        // Captura os dados do formulário como objeto
        const formData = new FormData(e.target);
        const rawData = Object.fromEntries(formData);

        // Reorganiza os dados para incluir os dados do cartão dentro de um objeto card_info
        const newData = {
            ...rawData,
            card_info: {
                number: rawData.cardNumber,
                cvv: rawData.cardCvv,
                expiration: rawData.cardDate,
            }
        };

        // Remove as propriedades antigas do cartão que estavam soltas no objeto principal
        delete newData.cardNumber;
        delete newData.cardCvv;
        delete newData.cardDate;

        console.log(newData);

        // Atualiza os dados locais do usuário para refletir as mudanças imediatamente na interface
        setUserdata(newData);
        setMode("view"); // volta para o modo de visualização

        // Envia a atualização para o backend via serviço de usuário
        await userService.updateUser(curUser, newData);
    }

    // Função para excluir a conta do usuário
    async function handleDelete() {
        await userService.deleteUser(curUser);
        // Limpa informações locais para forçar logout
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        // Redireciona para a página inicial
        navigate("/");
    }

    return (
        <div className='profile-page'>
            <div className='page-header'>
                <h1 className='page-title'>Perfil do Usuário</h1>
            </div>

            {/* Renderiza o conteúdo somente quando userData estiver disponível */}
            {userData && (
                <>
                    {/* Modo visualização: exibe dados do usuário */}
                    {curMode === "view" ? (
                        <div className='profile-content'>
                            <div className='section-card'>
                                <h2>Informações Pessoais</h2>
                                <p><strong>Nome:</strong> {userData.name}</p>
                                <p><strong>CPF:</strong> {userData.cpf}</p>
                                <p><strong>Email:</strong> {userData.email}</p>
                                <p><strong>Telefone:</strong> {userData.telephone}</p>
                            </div>

                            <div className='section-card'>
                                <h2>Endereço</h2>
                                <p>{userData?.address || "Endereço não registrado"}</p>
                            </div>

                            <div className='section-card'>
                                <h2>Cartão</h2>
                                {/* Se houver cartão cadastrado, exibe seus dados */}
                                {userData?.card_info ? (
                                    <>
                                        <p><strong>Número:</strong> {userData?.card_info.number}</p>
                                        <p><strong>CVV:</strong> {userData?.card_info.cvv}</p>
                                        <p><strong>Validade:</strong> {userData?.card_info.expiration}</p>
                                    </>
                                ) : (
                                    <p>Cartão não registrado</p>
                                )}
                            </div>

                            {/* Botões para alterar modo, sair ou excluir conta */}
                            <button className='action-btn edit' onClick={() => setMode("edit")}>
                                Gerenciar Informações
                            </button>
                            <button className='action-btn exit' onClick={() => {
                                localStorage.removeItem("token");
                                localStorage.removeItem("user");
                                navigate("/");
                            }}>
                                Sair
                            </button>
                            <button className='action-btn delete' onClick={handleDelete}>
                                Excluir conta
                            </button>
                        </div>
                    ) : (
                        // Modo edição: exibe formulário para alterar os dados do usuário
                        <form className='edit-form' onSubmit={handleSubmit}>
                            <div className='form-section'>
                                <h3>Informações Pessoais</h3>
                                <div className='form-group'>
                                    <label>Nome Completo</label>
                                    <input type="text" name="name" defaultValue={userData.name} required />
                                </div>
                                <div className='form-group'>
                                    <label>CPF</label>
                                    <input type="text" name="cpf" defaultValue={userData.cpf} required />
                                </div>
                                <div className='form-group'>
                                    <label>Email</label>
                                    <input type="email" name="email" defaultValue={userData.email} required />
                                </div>
                                <div className='form-group'>
                                    <label>Telefone</label>
                                    <input type="tel" name="telephone" defaultValue={userData.telephone} required />
                                </div>
                            </div>

                            <div className='form-section'>
                                <h3>Endereço</h3>
                                <div className='form-group'>
                                    <label>Endereço</label>
                                    <input type="text" name="address" defaultValue={userData?.address || ''} />
                                </div>
                            </div>

                            <div className='form-section'>
                                <h3>Cartão</h3>
                                <div className='form-group'>
                                    <label>Número</label>
                                    <input type="text" name="cardNumber" defaultValue={userData?.card?.number || ''} />
                                </div>
                                <div className='form-group'>
                                    <label>CVV</label>
                                    <input type="text" name="cardCvv" defaultValue={userData?.card?.cvv || ''} />
                                </div>
                                <div className='form-group'>
                                    <label>Data de Vencimento</label>
                                    <input type="text" name="cardDate" defaultValue={userData?.card?.date || ''} />
                                </div>
                            </div>

                            <div className='form-actions'>
                                <button type="submit" className="checkout-btn">Salvar</button>
                            </div>
                        </form>
                    )}
                </>
            )}
        </div>
    );
}
