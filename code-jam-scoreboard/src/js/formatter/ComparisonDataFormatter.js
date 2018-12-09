import _ from 'lodash';

export default class ComparisonDataFormatter {
  process(data) {
    const userIds = this._getUserIdThatPartisipateInBothCourses(data);
    return {
      puzzles: data[0].puzzles,
      users: this._buildComparisonData(data, userIds),
    };
  }

  _getUserIdThatPartisipateInBothCourses(data) {
    return _.map(_.intersectionBy(data[0].users, data[1].users, 'githubId'), 'githubId');
  }

  _buildComparisonData(data, userIds) {
    const currentUsers = _.filter(data[0].users, user => _.includes(userIds, user.githubId));
    const previousUsers = _.filter(data[1].users, user => _.includes(userIds, user.githubId));
    const results = [];
    _.each(currentUsers, (cUser) => {
      const previousUser = _.find(previousUsers, pUser => pUser.githubId === cUser.githubId);
      results.push({
        githubId: cUser.githubId,
        name: cUser.name,
        id: cUser.id,
        session: [previousUser.session[0], cUser.session[0]],
      });
    });

    return results;
  }
}
