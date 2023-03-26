const dictList = {
  J85: [
    {
      dicCode: 'J8501',
      dicName: '红色预警',
      pdicCode: 'J85',
    },
    {
      dicCode: 'J8502',
      dicName: '橙色预警',
      pdicCode: 'J85',
    },
    {
      dicCode: 'J8503',
      dicName: '黄色预警',
      pdicCode: 'J85',
    },
  ],
  E43: [
    {
      dicCode: 'E4301',
      dicName: '重大风险',
      pdicCode: 'E43',
    },
    {
      dicCode: 'E4302',
      dicName: '较大风险',
      pdicCode: 'E43',
    },
    {
      dicCode: 'E4303',
      dicName: '一般风险',
      pdicCode: 'E43',
    },
    {
      dicCode: 'E4304',
      dicName: '低风险',
      pdicCode: 'E43',
    },
  ],
};

module.exports = function (params) {
  const { pdicCode } = params;
  if (!pdicCode) return []
  return dictList[pdicCode];
};
