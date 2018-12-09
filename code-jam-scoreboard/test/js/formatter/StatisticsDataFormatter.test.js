/* global it, describe, expect, beforeEach, jest */
import * as fs from 'fs';
import 'jest';
import StatisticsDataFormatter from '../../../src/js/formatter/StatisticsDataFormatter';


const users = JSON.parse(fs.readFileSync('./test/data/users.json', 'utf-8'));
const sessions = JSON.parse(fs.readFileSync('./test/data/sessions.json', 'utf-8'));

describe('StatisticsDataFormatter', () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  it('_parseUsers', () => {
    const result = new StatisticsDataFormatter()._parseUsers(users);
    expect(result).toHaveLength(users.length);
    expect(result[0]).toEqual({
      id: 'a58dc9923e939274',
      githubId: '669784',
      name: 'Alexander Gerasimov',
    });
  });

  it('_parseUsers empty list', () => {
    const result = new StatisticsDataFormatter()._parseUsers([]);
    expect(result).toHaveLength(0);
  });

  it('_filterUserAnswers', () => {
    const result = new StatisticsDataFormatter()._filterUserAnswers('a58dc9923e939274', sessions[0]);
    expect(result).toHaveLength(2);
    result.forEach((element) => {
      expect(element).toHaveProperty('correct', 'Correct');
      expect(element).toHaveProperty('time', { $numberLong: '25' });
    });
  });

  it('_filterUserAnswers for user with invalid answers', () => {
    const result = new StatisticsDataFormatter()._filterUserAnswers('dd71f935e8bb4e97', sessions[0]);
    expect(result).toHaveLength(2);
    result.forEach((element) => {
      expect(element).not.toHaveProperty('correct', 'Correct');
      expect(element).toHaveProperty('time', { $numberLong: '150' });
    });
  });

  it('_filterUserAnswers for user without answers', () => {
    const result = new StatisticsDataFormatter()._filterUserAnswers('invalid', sessions[0]);
    expect(result).toHaveLength(2);
    result.forEach((element) => {
      expect(element).not.toHaveProperty('correct', 'Correct');
      expect(element).toHaveProperty('time', { $numberLong: '150' });
    });
  });

  it('_filterUserAnswers when session is empty', () => {
    const tmpSessions = JSON.parse(fs.readFileSync('./test/data/sessions.json', 'utf-8'));
    tmpSessions[0].rounds = [];
    const result = new StatisticsDataFormatter()._filterUserAnswers('invalid', tmpSessions[0]);
    result.forEach((element) => {
      expect(element).not.toHaveProperty('correct', 'Correct');
      expect(element).toHaveProperty('time', { $numberLong: '150' });
    });
  });

  it('_calculateOveralTime', () => {
    const answersWithTime = [
      { time: { $numberLong: 10 } },
      { time: { $numberLong: 20 } },
      { time: { $numberLong: 30 } },
    ];
    const sum = new StatisticsDataFormatter()._calculateOveralTime(answersWithTime);
    expect(sum).toEqual(60);
  });

  it('_calculateOveralTime with empty answers', () => {
    const answersWithTime = [];
    const sum = new StatisticsDataFormatter()._calculateOveralTime(answersWithTime);
    expect(sum).toEqual(0);
  });

  it('processUserData', () => {
    const result = new StatisticsDataFormatter().processUserData([users, sessions]);
    expect(result).not.toBeNull();
    expect(result.users).toHaveLength(12);
  });

  it('processUserData with empty sessions', () => {
    const result = new StatisticsDataFormatter().processUserData([users, []]);
    expect(result).not.toBeNull();
    expect(result.users).toHaveLength(12);
    result.users.forEach(user => expect(user.session).toHaveLength(0));
  });
});
