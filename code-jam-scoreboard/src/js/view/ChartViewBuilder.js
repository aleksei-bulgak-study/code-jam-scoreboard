import Chart from 'chart.js';
import _ from 'lodash';
import randomcolor from 'randomcolor';

export default class ChartViewBuilder {
  constructor() {
    document.body.addEventListener('addToChart', this._appendToChart.bind(this));
    document.body.addEventListener('removeFromChart', this._removeFromChart.bind(this));
    document.body.addEventListener('clear', this._clearChart.bind(this));
  }

  withData(data) {
    this.data = data;
    this.sessionId = 0;
    return this;
  }

  clean() {
    const chart = document.querySelector('canvas');
    if (chart) {
      chart.remove();
    }
  }

  build(sessionId = 0) {
    this.sessionId = sessionId;
    this.clean();

    const chart = document.createElement('canvas');
    document.body.append(chart);

    this._buildChart(chart.getContext('2d'));
    return this.data;
  }

  _appendToChart(event) {
    const user = event.detail;
    const color = randomcolor();
    this.chart.data.datasets.push({
      label: user.name,
      borderColor: color,
      backgroundColor: color,
      data: this._getUserStatistics(user),
      fill: false,
    });
    this.chart.update();
  }

  _removeFromChart(event) {
    const userInEvent = event.detail;
    const indexForDeletion = _.findIndex(this.chart.data.datasets,
      line => line.label === userInEvent.name);
    this.chart.data.datasets.splice(indexForDeletion, 1);
    this.chart.update();
  }

  _clearChart() {
    this.chart.data.datasets = [];
    this.chart.update();
  }

  _getUserStatistics(user) {
    return _.map(user.session[this.sessionId].answers, 'time.$numberLong');
  }

  _buildChart(chartCtx) {
    this.chart = new Chart(chartCtx, {
      type: 'line',

      data: {
        labels: this._buildLabelsArray(),
        datasets: [],
      },
      options: {
        scales: {
          yAxes: [{
            ticks: {
              beginAtZero: true,
              max: 155,
            },
          }],
        },
      },
    });
  }

  _buildLabelsArray() {
    return _.map(this.data.puzzles[this.sessionId].puzzles, 'name');
  }
}
