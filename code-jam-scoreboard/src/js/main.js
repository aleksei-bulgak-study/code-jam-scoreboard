import '../css/main.css';

import ApplicationController from './controller/Controller';

import DataProvider from './dataLoader/DataProvider';
import StatisticsDataFormatter from './formatter/StatisticsDataFormatter';
import ComparisonDataFormatter from './formatter/ComparisonDataFormatter';
import TableViewBuilder from './view/TableViewBuilder';
import ChartViewBuilder from './view/ChartViewBuilder';
import ComparisonTableView from './view/ComparisonTableView';

const USER_DATA = 'https://raw.githubusercontent.com/aleksei-bulgak-study/data/master/users.json';
const SESSIONS_DATA = 'https://raw.githubusercontent.com/aleksei-bulgak-study/data/master/sessions.json';
const Q1_SESSIONS_DATA = 'https://raw.githubusercontent.com/aleksei-bulgak-study/data/master/sessions-q1.json';
const Q1_USER_DATA = 'https://raw.githubusercontent.com/aleksei-bulgak-study/data/master/users-q1.json';
const MAX_NUMBERS_OF_USERS_ON_CHART = 10;

const dataProvider = new DataProvider(null, USER_DATA, SESSIONS_DATA, Q1_SESSIONS_DATA,
  Q1_USER_DATA);
const statisticsDataFormatter = new StatisticsDataFormatter();

const tableView = new TableViewBuilder(MAX_NUMBERS_OF_USERS_ON_CHART);
const chartView = new ChartViewBuilder();
const comparisonTableView = new ComparisonTableView();
const comparisonDataFormatter = new ComparisonDataFormatter();

const app = new ApplicationController(dataProvider, statisticsDataFormatter, tableView, chartView,
  comparisonTableView, comparisonDataFormatter);
app.init();
