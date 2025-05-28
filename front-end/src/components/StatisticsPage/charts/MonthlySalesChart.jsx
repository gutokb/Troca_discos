import React from 'react';
import { Line } from 'react-chartjs-2';

const MonthlySalesChart = () => {

    // When the back end is implemented, this info will be fetched
    const data = {
        labels: ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho'],
        datasets: [
            {
                label: 'Vendas',
                data: [65, 59, 80, 81, 56, 55],
                borderColor: 'rgb(75, 192, 192)',
                backgroundColor: 'rgba(75, 192, 192, 0.2)',
                tension: 0.1
            }
        ]
    };

    const options = {
        responsive: true,
        plugins: {
            legend: {
                position: 'top',
            }
        }
    };

    return <Line data={data} options={options} />;
};

export default MonthlySalesChart;