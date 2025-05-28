import {Pie} from 'react-chartjs-2';

const SalesByGenreChart = () => {

    // Mock data, when back end is implemented will fetch
    const data = {
        labels: ['Rock', 'Jazz', 'Metal', "Disco", 'Samba'],
        datasets: [
            {
                data: [60, 35, 20, 40, 23],
                backgroundColor: [
                    '#FF6384',
                    '#36A2EB',
                    '#e6ff56',
                    '#48130e',
                    "#7e18bb"
                ],
                hoverBackgroundColor: [
                    '#FF6384',
                    '#36A2EB',
                    '#FFCE56',
                    '#48130e',
                    "#7e18bb"
                ]
            }
        ]
    };

    const options = {
        responsive: true,
        plugins: {
            legend: {
                position: 'bottom',
            },
        }
    };

    return <Pie data={data} options={options} />;
};

export default SalesByGenreChart;