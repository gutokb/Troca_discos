import React, { useState, useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import Sidebar from '/src/components/Sidebar/Sidebar.jsx';
import StatisticsPage from '/src/components/StatisticsPage/StatisticsPage.jsx';
import ProductPage from '/src/components/ProductPage/ProductPage.jsx';
import UserPage from '/src/components/UserPage/UserPage.jsx';
import './AdminDashboard.css';
import Navbar from "../../components/Navbar/Navbar.jsx";
import { IoMenu, IoClose } from 'react-icons/io5';

export default function AdminDashboard() {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [isMobile, setIsMobile] = useState(false);

    // Check if screen is mobile size
    useEffect(() => {
        const checkScreenSize = () => {
            setIsMobile(window.innerWidth <= 768);
            // Auto close sidebar on desktop
            if (window.innerWidth > 768) {
                setIsSidebarOpen(false);
            }
        };

        checkScreenSize();
        window.addEventListener('resize', checkScreenSize);
        return () => window.removeEventListener('resize', checkScreenSize);
    }, []);

    const toggleSidebar = () => {
        setIsSidebarOpen(!isSidebarOpen);
    };

    const closeSidebar = () => {
        setIsSidebarOpen(false);
    };

    return (
        <>
            <Navbar/>
            <div className="admin-dashboard">
                {/* Mobile menu button */}
                {isMobile && (
                    <button
                        className="mobile-menu-btn"
                        onClick={toggleSidebar}
                        aria-label="Toggle menu"
                    >
                        {isSidebarOpen ? <IoClose /> : <IoMenu />}
                    </button>
                )}

                {/* Sidebar overlay for mobile */}
                {isMobile && isSidebarOpen && (
                    <div className="sidebar-overlay" onClick={closeSidebar}></div>
                )}

                <Sidebar
                    isOpen={isSidebarOpen}
                    onClose={closeSidebar}
                    isMobile={isMobile}
                />

                <div className={`admin-content ${isSidebarOpen && isMobile ? 'sidebar-open' : ''}`}>
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