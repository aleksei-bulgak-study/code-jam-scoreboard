export default class ApplicationController {
  constructor(dataProvider, statisticsDataFormatter, tableViewBuilder, chartViewBuilder) {
    this.dataProvider = dataProvider;
    this.statisticsDataFormatter = statisticsDataFormatter;
    this.tableViewBuilder = tableViewBuilder;
    this.chartViewBuilder = chartViewBuilder;

    this._applyEvents();
  }

  init() {
    this.dataProvider
      .loadData()
      .then(arrayOfResults => this.statisticsDataFormatter.processUserData(arrayOfResults))
      .then((data) => {
        this.tableViewBuilder.withData(data).build();
        return data;
      })
      .then(data => this.chartViewBuilder.withData(data).build());
  }

  _applyEvents() {
    document.body.querySelector('#challenge-selector')
      .addEventListener('click', (event) => {
        if (event.target.hasAttribute('type')) {
          const challenge = Number.parseInt(event.target.getAttribute('value'), 10);
          this.tableViewBuilder.build(challenge);
          this.chartViewBuilder.build(challenge);
        }
      });
  }
}
