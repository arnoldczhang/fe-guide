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

const pipe = (result, ...funcs) => funcs.reduce((res, func) => func(res), result);

const compose = (...funcs) => value => funcs.reduce((res, func) => func(res), value);

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
