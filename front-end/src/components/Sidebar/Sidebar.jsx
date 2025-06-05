import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import './Sidebar.css';
import { IoStatsChart, IoStorefront, IoPeople } from 'react-icons/io5';

export default function Sidebar({ isOpen, onClose, isMobile }) {
    const location = useLocation();

    const menuItems = [
        {
            path: '/admin/statistics',
            icon: <IoStatsChart />,
            label: 'Estatísticas',
            active: location.pathname === '/admin/statistics' || location.pathname === '/admin'
        },
        {
            path: '/admin/products',
            icon: <IoStorefront />,
            label: 'Produtos',
            active: location.pathname === '/admin/products'
        },
        {
            path: '/admin/users',
            icon: <IoPeople />,
            label: 'Usuários',
            active: location.pathname === '/admin/users'
        }
    ];

    const handleLinkClick = () => {
        if (isMobile && onClose) {
            onClose();
        }
    };

    return (
        <div className={`sidebar ${isOpen ? 'sidebar-open' : ''} ${isMobile ? 'sidebar-mobile' : ''}`}>
            <div className="sidebar-header">
                <img className="sidebar-logo" src="/src/assets/vynil.png" alt="Logo" />
                <h2 className="sidebar-title">Admin Panel</h2>
            </div>

            <nav className="sidebar-nav">
                {menuItems.map((item, index) => (
                    <Link
                        key={index}
                        to={item.path}
                        className={`sidebar-link ${item.active ? 'active' : ''}`}
                        onClick={handleLinkClick}
                    >
                        <span className="sidebar-icon">{item.icon}</span>
                        <span className="sidebar-label">{item.label}</span>
                    </Link>
                ))}
            </nav>
        </div>
    );
}