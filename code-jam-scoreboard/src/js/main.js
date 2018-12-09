import '../css/main.css';

import ApplicationController from './controller/Controller';

import DataProvider from './dataLoader/DataProvider';
import StatisticsDataFormatter from './formatter/StatisticsDataFormatter';
import TableViewBuilder from './view/TableViewBuilder';
import ChartViewBuilder from './view/ChartViewBuilder';

const USER_DATA = 'https://raw.githubusercontent.com/aleksei-bulgak-study/data/master/users.json';
const SESSIONS_DATA = 'https://raw.githubusercontent.com/aleksei-bulgak-study/data/master/sessions.json';
const Q1_SESSIONS_DATA = 'https://raw.githubusercontent.com/aleksei-bulgak-study/data/master/sessions-q1.json';
const MAX_NUMBERS_OF_USERS_ON_CHART = 10;

const dataProvider = new DataProvider(null, USER_DATA, SESSIONS_DATA, Q1_SESSIONS_DATA);
const statisticsDataFormatter = new StatisticsDataFormatter();

const tableView = new TableViewBuilder(MAX_NUMBERS_OF_USERS_ON_CHART);
const chartView = new ChartViewBuilder();

const app = new ApplicationController(dataProvider, statisticsDataFormatter, tableView, chartView);
app.init();
