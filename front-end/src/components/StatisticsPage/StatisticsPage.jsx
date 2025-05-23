import React from 'react';
import './StatisticsPage.css';
import { IoTrendingUp, IoPeople, IoStorefront, IoCard } from 'react-icons/io5';

export default function StatisticsPage() {
    // TODO: Fetch statistics data from API
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
                        {/* TODO: Implement chart using Chart.js, D3.js, or Recharts */}
                        <p>Gráfico de linha mostrando vendas mensais</p>
                        <p className="chart-library-note">
                            Recomendação: Use <strong>Chart.js</strong> para gráficos interativos,
                            <strong> Recharts</strong> para integração React, ou <strong>D3.js</strong> para visualizações customizadas
                        </p>
                    </div>
                </div>

                <div className="chart-container">
                    <h3 className="chart-title">Produtos Mais Vendidos</h3>
                    <div className="chart-placeholder">
                        {/* TODO: Implement bar chart */}
                        <p>Gráfico de barras dos produtos mais vendidos</p>
                    </div>
                </div>

                <div className="chart-container">
                    <h3 className="chart-title">Distribuição de Usuários</h3>
                    <div className="chart-placeholder">
                        {/* TODO: Implement pie chart */}
                        <p>Gráfico pizza da distribuição demográfica</p>
                    </div>
                </div>

                <div className="chart-container">
                    <h3 className="chart-title">Crescimento Temporal</h3>
                    <div className="chart-placeholder">
                        {/* TODO: Implement area chart */}
                        <p>Gráfico de área mostrando crescimento ao longo do tempo</p>
                    </div>
                </div>
            </div>
        </div>
    );
}