import {Pie} from 'react-chartjs-2';

const SalesByGenreChart = ({labels, values}) => {

    const data = {
        labels: labels,
        datasets: [
            {
                data: values,
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