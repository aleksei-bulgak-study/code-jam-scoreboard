export default class ApplicationController {
  constructor(dataProvider, statisticsDataFormatter) {
    this.dataProvider = dataProvider;
    this.statisticsDataFormatter = statisticsDataFormatter;
  }

  init() {
    this.dataProvider
      .loadData()
      .then((arrayOfResults) => {
        this.statisticsDataFormatter.processUserData(arrayOfResults);
      }).then((data) => {
        this.viewBuilder.withData(data).build();
      });

    this._initChartView();
  }

  _initChartView() {
    
  }
}
