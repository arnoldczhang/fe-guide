const { isArray } = Array;
const isObject = input => input && typeof input === 'object';

/**
 * [description]
 * @param  {[type]} list [description]
 * @param  {[type]} key  [description]
 * @return {[type]}      [description]
 */
const hasMatch = (list, key) => {
  for (let [oKey, oValue] of list) {
    if (key === oKey) {
      return oValue;
    }
  }
};

/**
 * [deepClone description]
 * @param  {[type]} target [description]
 * @return {[type]}        [description]
 */
function deepClone(target) {
  const result = isArray(target) ? [] : {};
  const list = [{ root: target }];
  const uniq = [];

  while (list.length) {
    let { root, res = result } = list.shift();
    Reflect.ownKeys(root).forEach((oKey) => {
      const value = root[oKey];
      if (isObject(value)) {
        const match = hasMatch(uniq, value);
        if (match) {
          res[oKey] = match;
        } else {
          res[oKey] = isArray(value) ? [] : {};
          list.push({
            root: value,
            res: res[oKey],
          });
          uniq.push([value, res[oKey]]);
        }
      } else {
        res[oKey] = value;
      }
    });
  }
  return result;
};

// test
// const one = {
//   a: [1, 'a'],
//   b: 'abc',
//   c: {
//     d: 123,
//   },
// };
// const res = deepClone(one);

// console.log(res);


