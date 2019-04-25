// JSON.stringify-polyfill
const UNDEF = void 0;

const originTypes = ['boolean', 'number', 'string'];
const transTypes = ['undefined', 'symbol'];

const arrayMap = Array.prototype.map;
const arrayFilter = Array.prototype.filter;
const match = list => input => (list || []).indexOf(input) > -1;
const matchOriginType = match(originTypes);
const matchTransType = match(transTypes);
const isAssign = input => input !== UNDEF;
const map = (target, iterator) => arrayMap.call(target, iterator);
const filter = (target, iterator) => arrayFilter.call(target, iterator);
const toString = target => typeof target.toString === 'function' ? target.toString() : String(target);

/**
 * [JSONStringify description]
 * @param {[type]} input       [description]
 * @param {[type]} replacement [description]
 * @param {[type]} space       [description]
 */
// TODO replacement
// TODO space
// TODO 循环引用
// =》如果一个对象的属性值通过某种间接的方式指回该对象本身，即循环引用，属性也会被忽略
function JSONStringify(input, replacement, space) {
  return stringify(input);
};

function stringify(input, inputType, key) {
  const type = typeof input;
  const keyStr = isAssign(key) ? `"${key}":` : '';
  if (matchOriginType(type) || input === null) {
    return `${keyStr}${type === 'string' ? `"${input}"` : input}`;
  }

  if (matchTransType(type)) {
    return inputType === 'array' ? 'null' : UNDEF;
  }

  const keys = Object.keys(input);
  return Array.isArray(input)
    ? `${keyStr}[${toString(map(keys, key => stringify(input[key], 'array')))}]`
    : `${keyStr}{${toString(filter(map(keys, key => stringify(input[key], 'object', key)), isAssign))}}`;
};

// test
// console.log(JSONStringify({x : 5}));
// console.log(JSON.stringify({x : 5}));
// console.log(JSONStringify([1, "false", false]));
// console.log(JSON.stringify([1, "false", false]));
// console.log(JSONStringify({a: 'abc', b: undefined, c: 1, d: [1, undefined, null, 'abc']}));
// console.log(JSON.stringify({a: 'abc', b: undefined, c: 1, d: [1, undefined, null, 'abc']}));
// console.log(JSONStringify([1, "false", false]));
// console.log(JSON.stringify([1, "false", false]));


