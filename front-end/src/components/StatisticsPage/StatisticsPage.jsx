<<<<<<< Updated upstream
import React, {useEffect, useState} from 'react';
import './StatisticsPage.css';
import { IoTrendingUp, IoPeople, IoStorefront, IoCard } from 'react-icons/io5';
=======
import React, { useEffect, useState } from 'react';
// Estilos CSS específicos para esta página
import './StatisticsPage.css';
// Ícones da biblioteca react-icons
import { IoTrendingUp, IoPeople, IoStorefront, IoCard } from 'react-icons/io5';
// Componentes de gráfico personalizados
>>>>>>> Stashed changes
import MonthlySalesChart from "./charts/MonthlySalesChart.jsx";
import SalesByGenreChart from './charts/SalesByGenreChart.jsx'
import TopArtistsChart from "./charts/TopArtistsChart.jsx";
<<<<<<< Updated upstream
import * as statsService from "../../services/statsService.js"


export default function StatisticsPage() {
    const [totalUsers, setTotalUsers] = useState(0);
    const [totalProducts, setTotalProducts] = useState(0);
    const [totalRevenue, setTotalRevenue] = useState(0);
    const [monthlyGrowth, setMontlhyGrowth] = useState(0)
    const [salesPerMonth, setSalesPerMonth] = useState([]);
    const [salesByGenre, setSalesByGenre] = useState([]);
    const [topArtists, setTopArtists] = useState([]);


    useEffect(() => {
        async function fetchData() {
            const data = await statsService.getData()
            setTotalUsers(data.totalUsers)
            setTotalProducts(data.totalRecords)
            setTotalRevenue(data.totalEarnings)
            setMontlhyGrowth(data.monthlyGrowth.growthPercentage)
            setSalesPerMonth(data.salesPerMonth)
            setSalesByGenre(data.salesByGenre)
            setTopArtists(data.mostSoldArtists)
=======
// Serviço responsável por obter dados estatísticos do backend
import * as statsService from "../../services/statsService.js";

export default function StatisticsPage() {
    // Estados para armazenar as métricas gerais
    const [totalUsers, setTotalUsers] = useState(0); // Número total de usuários
    const [totalProducts, setTotalProducts] = useState(0); // Número total de produtos (discos)
    const [totalRevenue, setTotalRevenue] = useState(0); // Receita total gerada
    const [monthlyGrowth, setMontlhyGrowth] = useState(0); // Crescimento percentual mensal

    // Estados para armazenar os dados dos gráficos
    const [salesPerMonth, setSalesPerMonth] = useState([]); // Vendas mensais (quantidade)
    const [salesByGenre, setSalesByGenre] = useState([]); // Vendas por gênero musical
    const [topArtists, setTopArtists] = useState([]); // Artistas mais vendidos

    // useEffect é executado apenas uma vez ao montar o componente
    useEffect(() => {
        async function fetchData() {
            const data = await statsService.getData(); // Busca os dados do backend

            // Atualiza os estados com os dados recebidos
            setTotalUsers(data.totalUsers);
            setTotalProducts(data.totalRecords);
            setTotalRevenue(data.totalEarnings);
            setMontlhyGrowth(data.monthlyGrowth.growthPercentage);
            setSalesPerMonth(data.salesPerMonth);
            setSalesByGenre(data.salesByGenre);
            setTopArtists(data.mostSoldArtists);
>>>>>>> Stashed changes
        }
        fetchData()
    }, [])

<<<<<<< Updated upstream
=======
        fetchData(); // Executa a função de busca
    }, []); // Array vazio: executa apenas uma vez

>>>>>>> Stashed changes
    return (
        <div className="statistics-page">
            <h1 className="page-title">Dashboard - Estatísticas</h1>

<<<<<<< Updated upstream
=======
            {/* Cartões com as métricas principais */}
>>>>>>> Stashed changes
            <div className="stats-grid">
                <div className="stat-card">
                    <div className="stat-icon users"><IoPeople /></div>
                    <div className="stat-info">
                        <h3 className="stat-number">{totalUsers}</h3>
                        <p className="stat-label">Total de Usuários</p>
                    </div>
                </div>

                <div className="stat-card">
                    <div className="stat-icon products"><IoStorefront /></div>
                    <div className="stat-info">
                        <h3 className="stat-number">{totalProducts}</h3>
                        <p className="stat-label">Total de Produtos</p>
                    </div>
                </div>

                <div className="stat-card">
                    <div className="stat-icon revenue"><IoCard /></div>
                    <div className="stat-info">
                        <h3 className="stat-number">R$ {totalRevenue}</h3>
                        <p className="stat-label">Receita Total</p>
                    </div>
                </div>

                <div className="stat-card">
                    <div className="stat-icon growth"><IoTrendingUp /></div>
                    <div className="stat-info">
<<<<<<< Updated upstream
                        <h3 className="stat-number">{`${monthlyGrowth>0?"+":""}${monthlyGrowth}`}%</h3>
=======
                        <h3 className="stat-number">{`${monthlyGrowth > 0 ? "+" : ""}${monthlyGrowth}`}%</h3>
>>>>>>> Stashed changes
                        <p className="stat-label">Crescimento Mensal</p>
                    </div>
                </div>
            </div>

<<<<<<< Updated upstream
            <div className="charts-section">
                <div className="chart-container">
                    <h3 className="chart-title">Vendas por Mês</h3>
                    <div className="chart-placeholder">
                        <MonthlySalesChart labels={salesPerMonth.map(sale => sale.month)} values={salesPerMonth.map(sale => sale.sales)}/>
                    </div>
                </div>

                <div className="chart-container">
                    <h3 className="chart-title">Vendas por gênero</h3>
                    <div className="chart-placeholder">
                        <SalesByGenreChart labels={salesByGenre.map(sale => sale.name)} values={salesByGenre.map(sale => sale.value)}/>
                    </div>
                </div>

                <div className="chart-container">
                    <h3 className="chart-title">Artistas mais procurados</h3>
                    <div className="chart-placeholder">
                       <TopArtistsChart labels={topArtists.map(sale => sale.artist)} values={topArtists.map(sale => sale.sales)}/>
=======
            {/* Seção com os gráficos */}
            <div className="charts-section">

                {/* Gráfico de vendas por mês */}
                <div className="chart-container">
                    <h3 className="chart-title">Vendas por Mês</h3>
                    <div className="chart-placeholder">
                        <MonthlySalesChart
                            labels={salesPerMonth.map(sale => sale.month)}
                            values={salesPerMonth.map(sale => sale.sales)}
                        />
                    </div>
                </div>

                {/* Gráfico de vendas por gênero */}
                <div className="chart-container">
                    <h3 className="chart-title">Vendas por gênero</h3>
                    <div className="chart-placeholder">
                        <SalesByGenreChart
                            labels={salesByGenre.map(sale => sale.name)}
                            values={salesByGenre.map(sale => sale.value)}
                        />
                    </div>
                </div>

                {/* Gráfico de artistas mais vendidos */}
                <div className="chart-container">
                    <h3 className="chart-title">Artistas mais procurados</h3>
                    <div className="chart-placeholder">
                        <TopArtistsChart
                            labels={topArtists.map(sale => sale.artist)}
                            values={topArtists.map(sale => sale.sales)}
                        />
>>>>>>> Stashed changes
                    </div>
                </div>

            </div>
        </div>
    );
}