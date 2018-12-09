import * as _ from 'lodash';

export default class StatisticsDataFormatter {
  processUserData(data) {
    const users = this._parseUsers(data[0]);
    _.each(users, (user) => {
      user.session = [];
      _.each((data[1]), (session) => {
        const answers = this._filterUserAnswers(user.id, session);
        const overalTime = this._calculateOveralTime(answers);
        user.session.push({
          answers,
          overalTime,
          name: session.game,
        });
      });
    });
    return {
      users,
      puzzles: data[1],
    };
  }

  _parseUsers(users) {
    return _.map(users, user => ({
      id: user.uid,
      githubId: user.providerId,
      name: user.displayName,
    }));
  }

  _filterUserAnswers(userId, session) {
    if (session.rounds && session.rounds.length > 0) {
      const results = [];
      _.forEach(session.rounds, (round, index) => {
        const solution = round.solutions[userId];
        if (solution) {
          results.push(solution);
        } else {
          results.push({
            time: {
              $numberLong: session.puzzles[index].options.timeLimit.$numberLong,
            },
          });
        }
      });
      return results;
    }
    return this._populateWithEmptyResults(userId, session);
  }

  _calculateOveralTime(userAnswers) {
    return _.reduce(userAnswers,
      (sum, answer) => sum + Number.parseInt(answer.time.$numberLong, 10), 0);
  }

  _populateWithEmptyResults(userId, session) {
    const results = [];
    _.each(session.puzzles, puzzler => results.push({
      time: {
        $numberLong: puzzler.options.timeLimit.$numberLong,
      },
    }));
    return results;
  }
}
