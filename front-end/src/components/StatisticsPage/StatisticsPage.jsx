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
        </div>
    );
}
