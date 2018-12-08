import * as _ from 'lodash';

export default class StatisticsDataFormatter {
  processUserData(data) {
    const users = this._parseUsers(data[0]);
    const session = data[1][0];
    _.forEach(users, (user) => {
      const answers = this._filterUserAnswers(user.id, session);
      const overalTime = this._calculateOveralTime(answers);
      user.session = [{
        answers,
        overalTime,
        name: session.game,
      }];
    });
    return {
      users,
      puzzles: session.puzzles,
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

  _calculateOveralTime(userAnswers) {
    return _.reduce(userAnswers,
      (sum, answer) => sum + Number.parseInt(answer.time.$numberLong, 10), 0);
  }
}
