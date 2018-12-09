/* global it, describe, expect */
import 'jest';
import ComparisonDataFormatter from '../../../src/js/formatter/ComparisonDataFormatter';

const data = [
  {
    users: [
      { githubId: 1, session: ['test 1'] },
      { githubId: 2, session: ['test 2'] },
      { githubId: 3, session: ['test 3'] },
      { githubId: 4, session: ['test 4'] },
    ],
  },
  {
    users: [
      { githubId: 3, session: ['test prev 3'] },
      { githubId: 4, session: ['test prev 4'] },
      { githubId: 5, session: ['test prev 5'] },
      { githubId: 6, session: ['test prev 6'] },
    ],
  },
];

describe('ComparisonDataFormatter', () => {
  it('_getUserIdThatPartisipateInBothCourses', () => {
    const result = new ComparisonDataFormatter()._getUserIdThatPartisipateInBothCourses(data);
    expect(result).toEqual([3, 4]);
  });

  it('_buildComparisonData', () => {
    const result = new ComparisonDataFormatter()._buildComparisonData(data, [3, 4]);
    expect(result).toHaveLength(2);
    expect(result[0].githubId).toEqual(3);
    expect(result[0].session[0]).toEqual('test prev 3');
    expect(result[0].session[1]).toEqual('test 3');
    expect(result[1].githubId).toEqual(4);
    expect(result[1].session[0]).toEqual('test prev 4');
    expect(result[1].session[1]).toEqual('test 4');
  });

  it('process', () => {
    expect(new ComparisonDataFormatter().process(data).users).toHaveLength(2);
  });
});
