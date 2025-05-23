import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Sidebar from '/src/components/Sidebar/Sidebar.jsx';
import StatisticsPage from '/src/components/StatisticsPage/StatisticsPage.jsx';
import ProductPage from '/src/components/ProductPage/ProductPage.jsx';
import UserPage from '/src/components/UserPage/UserPage.jsx';
import './AdminDashboard.css';
import Navbar from "../../components/Navbar/Navbar.jsx";

export default function AdminDashboard() {
    return (
        <>
            <Navbar/>
            <div className="admin-dashboard">
                <Sidebar />
                <div className="admin-content">
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