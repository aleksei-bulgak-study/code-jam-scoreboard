import '../css/main.css';

import ApplicationController from './controller/Controller';

import DataProvider from './dataLoader/DataProvider';
import StatisticsDataFormatter from './formatter/StatisticsDataFormatter';
import TableViewBuilder from './view/TableViewBuilder';
import ChartViewBuilder from './view/ChartViewBuilder';

const USER_DATA = 'https://raw.githubusercontent.com/aleksei-bulgak-study/data/master/users.json';
const SESSIONS_DATA = 'https://raw.githubusercontent.com/aleksei-bulgak-study/data/master/sessions.json';

const dataProvider = new DataProvider(null, USER_DATA, SESSIONS_DATA);
const statisticsDataFormatter = new StatisticsDataFormatter();

const tableView = new TableViewBuilder();
const chartView = new ChartViewBuilder();

const app = new ApplicationController(dataProvider, statisticsDataFormatter, tableView, chartView);
app.init();
