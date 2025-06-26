import React, { useState, useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';

// Importa componentes da interface administrativa
import Sidebar from '/src/components/Sidebar/Sidebar.jsx';
import StatisticsPage from '/src/components/StatisticsPage/StatisticsPage.jsx';
import ProductPage from '/src/components/ProductPage/ProductPage.jsx';
import UserPage from '/src/components/UserPage/UserPage.jsx';

// Importa estilos específicos e componentes auxiliares
import './AdminDashboard.css';
import Navbar from "../../components/Navbar/Navbar.jsx";
import { IoMenu, IoClose } from 'react-icons/io5';

// Componente principal do painel administrativo, gerencia layout, navegação e responsividade
export default function AdminDashboard() {
    // Estado que controla se a sidebar está aberta ou fechada
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    // Estado que indica se o dispositivo é mobile (largura menor ou igual a 768px)
    const [isMobile, setIsMobile] = useState(false);

    // Hook que monitora o tamanho da tela para ajustar responsividade
    useEffect(() => {
        const checkScreenSize = () => {
            setIsMobile(window.innerWidth <= 768); // Define mobile se a largura for menor ou igual a 768px
            if (window.innerWidth > 768) {
                setIsSidebarOpen(false); // Fecha sidebar automaticamente em telas maiores (desktop)
            }
        };

        checkScreenSize(); // Verifica imediatamente ao montar
        window.addEventListener('resize', checkScreenSize); // Atualiza no redimensionamento da janela
        return () => window.removeEventListener('resize', checkScreenSize); // Remove listener ao desmontar componente
    }, []);

    // Função para alternar estado da sidebar (abrir/fechar)
    const toggleSidebar = () => {
        setIsSidebarOpen(!isSidebarOpen);
    };

    // Função para fechar a sidebar
    const closeSidebar = () => {
        setIsSidebarOpen(false);
    };

    return (
        <>
            <Navbar /> {/* Barra de navegação fixa no topo */}

            <div className="admin-dashboard">
                {/* Botão para abrir/fechar menu lateral em dispositivos móveis */}
                {isMobile && (
                    <button
                        className="mobile-menu-btn"
                        onClick={toggleSidebar}
                        aria-label="Toggle menu"
                    >
                        {/* Ícone muda entre menu aberto (X) e fechado (hamburger) */}
                        {isSidebarOpen ? <IoClose /> : <IoMenu />}
                    </button>
                )}

                {/* Sobreposição da sidebar em mobile para fechar ao clicar fora */}
                {isMobile && isSidebarOpen && (
                    <div className="sidebar-overlay" onClick={closeSidebar}></div>
                )}

                {/* Sidebar recebe estados para controlar abertura e fechar em mobile */}
                <Sidebar
                    isOpen={isSidebarOpen}
                    onClose={closeSidebar}
                    isMobile={isMobile}
                />

                {/* Área principal de conteúdo que se ajusta quando sidebar está aberta em mobile */}
                <div className={`admin-content ${isSidebarOpen && isMobile ? 'sidebar-open' : ''}`}>
                    {/* Rotas internas do dashboard para diferentes seções */}
                    <Routes>
                        <Route path="/" element={<StatisticsPage />} />
                        <Route path="/statistics" element={<StatisticsPage />} />
                        <Route path="/products" element={<ProductPage />} />
                        <Route path="/users" element={<UserPage />} />
                    </Routes>
                </div>
            </div>
        </>
    );
}
