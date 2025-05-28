import { Bar } from "react-chartjs-2";

const TopArtistsChart = () => {
    const data = {
        labels: ['The Beatles', 'Michael Jackson', 'Dire Straits', 'Zeca Pagodinho', 'Tim Maia', 'Bob Marley'],
        datasets: [
            {
                label: 'Votes',
                data: [23, 19, 12, 8, 6, 3],
                backgroundColor: [
                    'rgba(255, 99, 132, 0.8)',
                    'rgba(54, 162, 235, 0.8)',
                    'rgba(255, 205, 86, 0.8)',
                    'rgba(75, 192, 192, 0.8)',
                    'rgba(153, 102, 255, 0.8)',
                    'rgba(255, 159, 64, 0.8)',
                ],
                borderColor: [
                    'rgba(255, 99, 132, 1)',
                    'rgba(54, 162, 235, 1)',
                    'rgba(255, 205, 86, 1)',
                    'rgba(75, 192, 192, 1)',
                    'rgba(153, 102, 255, 1)',
                    'rgba(255, 159, 64, 1)',
                ],
                borderWidth: 1,
            },
        ],
    };

    const options = {
        responsive: true,
        plugins: {
            legend: {
                display: false,
            },
        },
        scales: {
            y: {
                beginAtZero: true,
            }
        }
    };

    return <Bar data={data} options={options} />;
};

export default TopArtistsChart;