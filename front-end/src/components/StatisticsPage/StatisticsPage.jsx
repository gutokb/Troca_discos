import React from 'react';
import './StatisticsPage.css';
import { IoTrendingUp, IoPeople, IoStorefront, IoCard } from 'react-icons/io5';
import MonthlySalesChart from "./charts/MonthlySalesChart.jsx";
import SalesByGenreChart from './charts/SalesByGenreChart.jsx'
import TopArtistsChart from "./charts/TopArtistsChart.jsx";

export default function StatisticsPage() {
    // TODO: Fetch statistics data from API, requires back end
    const stats = {
        totalUsers: 1234,
        totalProducts: 567,
        totalRevenue: 89012,
        monthlyGrowth: 12.5
    };

    return (
        <div className="statistics-page">
            <h1 className="page-title">Dashboard - Estatísticas</h1>

            <div className="stats-grid">
                <div className="stat-card">
                    <div className="stat-icon users">
                        <IoPeople />
                    </div>
                    <div className="stat-info">
                        <h3 className="stat-number">{stats.totalUsers.toLocaleString()}</h3>
                        <p className="stat-label">Total de Usuários</p>
                    </div>
                </div>

                <div className="stat-card">
                    <div className="stat-icon products">
                        <IoStorefront />
                    </div>
                    <div className="stat-info">
                        <h3 className="stat-number">{stats.totalProducts.toLocaleString()}</h3>
                        <p className="stat-label">Total de Produtos</p>
                    </div>
                </div>

                <div className="stat-card">
                    <div className="stat-icon revenue">
                        <IoCard />
                    </div>
                    <div className="stat-info">
                        <h3 className="stat-number">R$ {stats.totalRevenue.toLocaleString()}</h3>
                        <p className="stat-label">Receita Total</p>
                    </div>
                </div>

                <div className="stat-card">
                    <div className="stat-icon growth">
                        <IoTrendingUp />
                    </div>
                    <div className="stat-info">
                        <h3 className="stat-number">+{stats.monthlyGrowth}%</h3>
                        <p className="stat-label">Crescimento Mensal</p>
                    </div>
                </div>
            </div>

            <div className="charts-section">
                <div className="chart-container">
                    <h3 className="chart-title">Vendas por Mês</h3>
                    <div className="chart-placeholder">
                        <MonthlySalesChart/>
                    </div>
                </div>

                <div className="chart-container">
                    <h3 className="chart-title">Vendas por gênero</h3>
                    <div className="chart-placeholder">
                        <SalesByGenreChart/>
                    </div>
                </div>

                <div className="chart-container">
                    <h3 className="chart-title">Artistas mais procurados</h3>
                    <div className="chart-placeholder">
                       <TopArtistsChart/>
                    </div>
                </div>

            </div>
        </div>
    );
}