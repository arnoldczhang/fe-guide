import { isPlainObject, isAa } from './test-lib';
const { isPlainObject: aaaa } = require('./test-lib');
const test = require('./test-lib');

test.isPlainObject({}, 'aaaabbbb');
isPlainObject({
  cc: 'a123'
});

function aaa() {
  aaaa({});
};
