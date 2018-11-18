/**
 * 
 * FP base
 * 
 */
const {
  isArray,
  from,
} = Array;

const eq = (t, opts = { deep: true }) => v => deep ? v === t : v == t;

const gt = t => v => v > t;

const lt = t => v => v < t;

const rand = (base = 10) => base + parseInt(Math.random() * base, 10);

const pipe = (result, ...funcs) => {
  if (!funcs.length && isArray(result)) {
    funcs = result.slice(1);
    result = result[0];
  }
  return funcs.reduce((res, func) => func(res), result);
};

const compose = (...funcs) => value => {
  const funcsArray = funcs.length === 1 && isArray(funcs[0]) ? funcs[0] : funcs;
  return funcsArray.reduce((res, func) => func(res), value);
};

const array = (length = 0) => from({ length });

const sum = (arr = []) => isArray(arr) ? arr.reduce((res, val) => res + val, 0) : arr;

const filter = condition => arr => isArray(arr) ? arr.filter(condition) : arr;

const FP = {
  eq,
  gt,
  lt,
  rand,
  compose,
  pipe,
  array,
  sum,
  filter,
};

module.exports = FP;
