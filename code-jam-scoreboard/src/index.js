import ApplicationController from './controller/Controller';

import DataProvider from './dataLoader/DataProvider';
import StatisticsDataFormatter from './formatter/StatisticsDataFormatter';

const USER_DATA = 'https://raw.githubusercontent.com/aleksei-bulgak-study/data/master/users.json';
const SESSIONS_DATA = 'https://raw.githubusercontent.com/aleksei-bulgak-study/data/master/sessions.json';

const dataProvider = new DataProvider(null, USER_DATA, SESSIONS_DATA);
const statisticsDataFormatter = new StatisticsDataFormatter();

const app = new ApplicationController(dataProvider, statisticsDataFormatter);
app.init();
