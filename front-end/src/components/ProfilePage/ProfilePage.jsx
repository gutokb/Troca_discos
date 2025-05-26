import React, { useEffect, useState } from 'react';
import { API_URL } from "../../config/api.js";
import './ProfilePage.css'

export default function ProfilePage() {
    const [curUser, setCurUser] = useState(4);
    const [userData, setUserdata] = useState(null);
    const [curMode, setMode] = useState("view");

    useEffect(() => {
        async function fetchUser() {
            const response = await fetch(`${API_URL}/users/${curUser}`);
            const data = await response.json();
            setUserdata(data);
        }
        fetchUser();
    }, [curUser]);

    function handleSubmit(e) {
        e.preventDefault();
        const formData = new FormData(e.target);
        const newData = Object.fromEntries(formData);
        setUserdata(newData);
        setMode("view");

        fetch(`${API_URL}/users/${curUser}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(newData),
        }).catch(console.error);
    }

    return (
        <div className='profile-page'>
            <div className='page-header'>
                <h1 className='page-title'>Perfil do Usuário</h1>
            </div>
            {userData && (
                <>
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
                        {userData?.cardNumber ? (
                            <>
                                <p><strong>Número:</strong> {userData.cardNumber}</p>
                                <p><strong>CVV:</strong> {userData.cardCvv}</p>
                                <p><strong>Validade:</strong> {userData.cardDate}</p>
                            </>
                        ) : (
                            <p>Cartão não registrado</p>
                        )}
                    </div>
                    <button className='action-btn edit' onClick={() => setMode("edit")}>
                        Gerenciar Informações
                    </button>
                </div>
            ) : (
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
