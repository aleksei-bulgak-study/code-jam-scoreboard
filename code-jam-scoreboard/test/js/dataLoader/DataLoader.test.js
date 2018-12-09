/* global it, describe, expect, beforeEach */
import DataProvider from '../../../src/js/dataLoader/DataProvider';

global.fetch = require('jest-fetch-mock');

const USER_DATA = 'http://example.com/users';
const SESSIONS_DATA = 'http://example.com/sessions';
const Q1_USER_DATA = 'http://example.com/users-qa1';
const Q1_SESSIONS_DATA = 'http://example.com/sessions-qa1';

const dataProvider = new DataProvider(USER_DATA, SESSIONS_DATA, Q1_SESSIONS_DATA,
  Q1_USER_DATA);

describe('DataProvider', () => {
  beforeEach(() => {
    fetch.resetMocks();
  });

  it('test load', () => {
    fetch
      .once(JSON.stringify({ user: 'user data' }))
      .once(JSON.stringify({ sessions: 'test data' }));
    dataProvider.loadData().then((response) => {
      expect(response).toEqual([{ user: 'user data' }, { sessions: 'test data' }]);
    });

    expect(fetch.mock.calls[0][0]).toEqual(USER_DATA);
    expect(fetch.mock.calls[1][0]).toEqual(SESSIONS_DATA);
  });

  it('test load previous', () => {
    fetch
      .once(JSON.stringify({ user: 'user previous data' }))
      .once(JSON.stringify({ sessions: 'test previous data' }));
    dataProvider.loadPreviousGroup().then((response) => {
      expect(response).toEqual([{ user: 'user previous data' }, { sessions: 'test previous data' }]);
    });

    expect(fetch.mock.calls[0][0]).toEqual(Q1_USER_DATA);
    expect(fetch.mock.calls[1][0]).toEqual(Q1_SESSIONS_DATA);
  });
});
