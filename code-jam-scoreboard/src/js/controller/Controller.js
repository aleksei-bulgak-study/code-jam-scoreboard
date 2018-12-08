export default class ApplicationController {
  constructor(dataProvider, statisticsDataFormatter, tableViewBuilder, chartViewBuilder) {
    this.dataProvider = dataProvider;
    this.statisticsDataFormatter = statisticsDataFormatter;
    this.tableViewBuilder = tableViewBuilder;
    this.chartViewBuilder = chartViewBuilder;
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
}
