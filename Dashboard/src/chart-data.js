export const planetChartData = {
  type: 'bar',
  data: {
    labels: [],
    datasets: [
      { // one line graph
        label: 'Temperature',
        data: [],
        backgroundColor: [],
        borderColor: [
          '#36495d',
          '#36495d',
          '#36495d',
          '#36495d',
          '#36495d',
          '#36495d',
          '#36495d',
          '#36495d',
        ],
        borderWidth: 3
      },
      { // another line graph
        label: 'Humidity',
        data: [],
        backgroundColor: [
          'rgba(71, 183,132,.5)',
          'rgba(71, 183,132,.5)',
          'rgba(71, 183,132,.5)'// Green
        ],
        borderColor: [
          '#47b784',
          '#47b784',
          '#47b784'
        ],
        borderWidth: 3
      }
    ]
  },
  options: {
    responsive: true,
    lineTension: 1,
    scales: {
      yAxes: [{
        ticks: {
          beginAtZero: true,
          padding: 25,
        }
      }]
    }
  }
}

export default planetChartData;
