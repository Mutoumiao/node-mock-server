const Mock = require('mockjs');

module.exports = function (params) {
  const { size = 10, current = 1 } = params || {};
  return Mock.mock({
    [`records|${size}`]: [
      {
        id: '@id',
        startTime: '@datetime("yyyyMMddHHmmss")',
        rank: 'J8501',
        rankName: '红色预警',
        message: '@csentence',
        pubDeptName: 'xx部门',
        'warnStatus|+1': ['1', '0'],
        endTime: '@datetime("yyyyMMddHHmmss")',
        feedback: '1',
      },
    ],
    total: 50,
    size,
    current,
    searchCount: true,
    pages: 1,
  });
};
