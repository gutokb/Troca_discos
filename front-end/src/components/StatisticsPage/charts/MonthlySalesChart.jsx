import React from 'react';
import { Line } from 'react-chartjs-2';

const MonthlySalesChart = ({labels, values}) => {

    // When the back end is implemented, this info will be fetched
    const data = {
        labels: labels,
        datasets: [
            {
                label: 'Vendas',
                data: values,
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