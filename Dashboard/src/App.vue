<template>
  <div id="app">
    <h1 style="text-align: center">Real Time Data of Devices</h1>
    <table style="width: 100%">
      <tr>
        <td>Devices</td>
        <td>Temperature</td>
        <td>Humidity</td>
      </tr>
      <tr>
        <td>dummy-temp-1</td>
        <td>{{ dummyTempTemp1 }}</td>
        <td>{{ dummyTempHud1 }}</td>
      </tr>
      <tr>
        <td>dummy-temp-2</td>
        <td>{{ dummyTempTemp2 }}</td>
        <td>{{ dummyTempHud2 }}</td>
      </tr>
      <tr>
        <td>dummy-temp-3</td>
        <td>{{ dummyTempTemp3 }}</td>
        <td>{{ dummyTempHud3 }}</td>
      </tr>
    </table>

    <div><h1><br><br>Real Time Data Chart</h1>
      <canvas id="planet-chart"></canvas>
    </div>

    <div>
      <h1><br><br>Historical Data</h1>
      <label>How many data would you like to check</label>

      <input v-model = "selected" placeholder=" ">

      <!--
      <select v-model="selected">
        <option disabled value="">Please select one</option>
        <option>{{ option1 }}</option>
        <option>{{ option2 }}</option>
        <option>{{ option3 }}</option>
      </select>!-->

      <button @click="submit()">Confirm</button>

      <table style="width: 100%">
        <tr>
          <th>dummy-temp-1</th>
          <td>
            <canvas id="dummy-temp-1graph"></canvas>
          </td>
        </tr>

        <tr>
          <th>dummy-temp-2</th>
          <td>
            <canvas id="dummy-temp-2graph"></canvas>
          </td>
        </tr>
        <tr>
          <th>dummy-temp-3</th>
          <td>
            <canvas id="dummy-temp-3graph"></canvas>
          </td>
        </tr>
      </table>

    </div>

  </div>
</template>

<script>
import {namesRef, db} from "./firebase";
import Chart from 'chart.js';
import planetChartData from './chart-data.js';


let global = {}

function getTime(time) {
  return new Date( time ).toLocaleTimeString()
}

function initChart(ctx, title, data, limit) {
  if (data.length > limit) data = data.slice( 0, limit );

  return new Chart( ctx, {
    type: 'line',
    data: {
      labels: data.map( d => getTime( d.time ) ),
      datasets: [
        {
          label: 'Temperature',
          data: data.map( d => d.temperature.toFixed( 2 ) ),
          borderColor: 'rgba(255, 165, 0, 1)',
          backgroundColor: 'rgba(255, 165, 0, 0.2)'
        }, {
          label: 'Humidity',
          data: data.map( d => d.humidity.toFixed( 2 ) ),
          borderColor: 'rgba(75, 192, 192, 1)',
          backgroundColor: 'rgba(75, 192, 192, 0.2)'
        },
      ]
    },
    options: {
      title: {
        display: true,
        text: title
      },
      scales: {
        yAxes: [{
          ticks: {
            suggestedMin: 0,
            suggestedMax: 100
          }
        }]
      },
    }
  } )
}

function getTime(time) {
  return new Date( time ).toLocaleTimeString()
}

export default {
  data() {
    return {
      dummyTempTemp1: '-',
      dummyTempTemp2: '-',
      dummyTempTemp3: '-',
      dummyTempHud1: '-',
      dummyTempHud2: '-',
      dummyTempHud3: '-',
      option1: 5,
      option2: 10,
      option3: 15,
      selected: '',
      connection: null,
      planetChartData: planetChartData,
    }
  },

  functions: {
    names: namesRef
  },
  mounted() {
    const devices = Array( 'dummy-temp-1', 'dummy-temp-2', 'dummy-temp-3' );
    const ref = this;
    for (const device of devices) {
      const usersRef = namesRef.child( `Sensor/${device}` );
      usersRef.on( "value", function (snapshot) {
        if (device == "dummy-temp-1") {
          ref.dummyTempTemp1 = snapshot.val().temperature;
          ref.dummyTempHud1 = snapshot.val().humidity;
        } else if (device == "dummy-temp-2") {
          ref.dummyTempTemp2 = snapshot.val().temperature;
          ref.dummyTempHud2 = snapshot.val().humidity;
        } else if (device == "dummy-temp-3") {
          ref.dummyTempTemp3 = snapshot.val().temperature;
          ref.dummyTempHud3 = snapshot.val().humidity;
        }
        const bar_chart = 'planet-chart'
        global[bar_chart].data.datasets[0].data = [ref.dummyTempTemp1, ref.dummyTempTemp2, ref.dummyTempTemp3];
        global[bar_chart].data.datasets[1].data = [ref.dummyTempHud1, ref.dummyTempHud2, ref.dummyTempHud3];
        global[bar_chart].data.labels = ['dummy-temp-1', 'dummy-temp-2', 'dummy-temp-3'];
        global[bar_chart].update()
      }, function (errorObject) {
        console.log( "The read failed: " + errorObject.code );
      } );
    }
    this.createChart( 'planet-chart', this.planetChartData );

  },

  methods: {
    createChart: function (chartId, chartData) {
      const ctx = document.getElementById( chartId );
      global[chartId] = new Chart( ctx, {
        type: chartData.type,
        data: chartData.data,
        options: chartData.options,
      } );
    },
    submit() {
      const devices = ['dummy-temp-1', 'dummy-temp-2', 'dummy-temp-3']
      const list = []
      for (const device of devices) {
        require( 'http' ).get( `http://localhost:3000/${device}/${this.selected}`
          , res => {
            res.on( 'data', (data) => {
              const new_data = (JSON.parse( data.toString() ))
              global[`${device}graph`] = initChart( document.getElementById( `${device}graph` ).getContext( '2d' ), 'title', new_data, 50 )
            } );
          } )
      }
    }
  }

}


</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}

h1, h2 {
  font-weight: normal;
}

ul {
  list-style-type: none;
  padding: 0;
}

li {
  margin: 0 10px;
}

a {
  color: #42b983;
}

button {
  background-color: transparent;
  border: 2px solid
}

td{
  background-color:#D3D3D3;
  border: 1px solid;
  border-color: black;
}

th{
  background-color: #D3D3D3;
  border: 2px solid;
}
</style>
