export default class ApplicationController {
  constructor(dataProvider, statisticsDataFormatter, tableViewBuilder, chartViewBuilder,
    comparisonViewBuilder, comparisonDataFormatter) {
    this.dataProvider = dataProvider;
    this.statisticsDataFormatter = statisticsDataFormatter;
    this.tableViewBuilder = tableViewBuilder;
    this.chartViewBuilder = chartViewBuilder;
    this.comparisonViewBuilder = comparisonViewBuilder;
    this.comparisonDataFormatter = comparisonDataFormatter;

    this._applyEvents();
  }

  init() {
    this.dataProvider
      .loadData()
      .then(arrayOfResults => this.statisticsDataFormatter.processUserData(arrayOfResults))
      .then(data => this.tableViewBuilder.withData(data).build())
      .then(data => this.chartViewBuilder.withData(data).build())
      .then(data => Promise.all([data, this.dataProvider.loadPreviousGroup()]))
      .then(data => [
        data[0],
        this.statisticsDataFormatter.processUserData(data[1]),
      ])
      .then(data => this.comparisonDataFormatter.process(data))
      .then(data => this.comparisonViewBuilder.withData(data));
  }

  _applyEvents() {
    document.body.querySelector('#challenge-selector')
      .addEventListener('click', (event) => {
        if (event.target.hasAttribute('type')) {
          const challenge = Number.parseInt(event.target.getAttribute('value'), 10);
          if (challenge < 2) {
            this.tableViewBuilder.build(challenge);
            this.chartViewBuilder.build(challenge);
          } else {
            this.comparisonViewBuilder.build();
            this.chartViewBuilder.build(0);
          }
        }
      });
  }
}
