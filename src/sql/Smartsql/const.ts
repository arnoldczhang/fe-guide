const TYPE: ICO = {
  eq: 'eq',
  notEq: 'notEq',
  gt: 'gt',
  gte: 'gte',
  lt: 'lt',
  lte: 'lte',
  and: 'and',
  divide: 'divide',
  multiply: 'multiply',
  add: 'add',
  minus: 'minus',
  max: 'max',
  min: 'min',
  avg: 'avg',
  desc: 'desc',
  asc: 'asc',
  count: 'count',
  toUInt32: 'toUInt32',
  countMerge: 'countMerge',
  uniqMerge: 'uniqMerge',
  anyMerge: 'anyMerge',
  sumMerge: 'sumMerge',
  interval: 'interval',
  toUnixTimestamp: 'toUnixTimestamp',
  toDateTime: 'toDateTime',
  toStartOfInterval: 'toStartOfInterval',
  splitArray: 'splitArray',
  wrap: 'wrap',
  toString: 'toString',
  rename: 'rename',
  as: 'as',
  in: 'in',
  notIn: 'notIn',
  uniq: 'uniq',
  operate: 'operate',
  nullIf: 'nullIf',
};

export const NOT_IN_TAG = '!in';

export const NOT_EQ_TAG = '!=';

export const GT_TAG = '>';

export const GTE_TAG = '>=';

export const LT_TAG = '<';

export const LTE_TAG = '<=';

export default TYPE;
