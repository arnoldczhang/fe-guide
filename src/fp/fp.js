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

const pipe2 = (...funcs) => (value) => {
  const list = [...funcs];
  while(list.length) {
    value = list.shift()(value);
  }
  return value;
};

const compose = (...funcs) => (value) => {
  const funcsArray = funcs.length === 1 && isArray(funcs[0]) ? funcs[0] : funcs;
  return funcsArray.reduce((res, func) => func(res), value);
};

const compose2 = (...funcs) => (value) => {
  // method: 1
  // return [...funcs].reverse().reduce((res, func) => func(res), value);
  // method: 2
  // return [...funcs].reduceRight((res, func) => func(res), value);
  // method: 3
  const list = [...funcs];
  while(list.length) {
    value = list.pop()(value);
  }
  return value;
};

const array = (length = 0) => from({ length });

const sum = (arr = []) => isArray(arr) ? arr.reduce((res, val) => res + val, 0) : arr;

const filter = condition => arr => isArray(arr) ? arr.filter(condition) : arr;

const partial = (fn, ...preArgs) => (...lastArgs) => fn(...preArgs, ...lastArgs);

const partialThis = (fn, ...preArgs) => function partialThisInner(...lastArgs) {
  return fn.call(this, ...preArgs, ...lastArgs);
};

const partialRight = (fn, ...preArgs) => (...lastArgs) => fn(...lastArgs, ...preArgs);

const not = predicate => (...args) => !predicate(...args);

const when = (predicate, fn) => (...args) => predicate(...args) ? fn(...args) : void 0;

const curry = (fn, arity = fn.length) => {
  const nextCurried = (prevArgs) => {
    return (...nextArgs) => {
      const args = [...prevArgs, ...nextArgs];

      if (args.length >= arity) {
        return fn(...args);
      }
      return nextCurried(args);
    };
  };
  return nextCurried([]);
};

const uncurry = (fn) => {
  return (...args) => {
    let ret = fn;
    for (let arg of args) {
      ret = ret(arg);
    }
    return ret;
  };
};

const curryProps = (fn, arity = fn.length) => {
  const nextCurry = (preProps) => {
    return (nextProps = {}) => {
      const [ key ] = Object.keys(nextProps);
      const props = Object.assign({}, preProps, { [key]: nextProps[key] });
      if (Object.keys(props).length >= arity) {
        return fn(props);
      }
      return nextCurry(props);
    };
  };
  return nextCurry({});
};

const partialProps = (fn,presetArgsObj) => {
    return (laterArgsObj) => {
        return fn(Object.assign({}, presetArgsObj, laterArgsObj));
    };
};

const unary = (func) => (...args) => func(args[0]);

const binary = (func) => (...args) => func(args[0], args[1]);

const map = (mapperFn, arr) => {
  const newList = [];
  for (let [idx, v] of arr.entries()) {
    newList.push(
      mapperFn(v, idx, arr)
    );
  }
  return newList;
};

const filter_ = (predicateFn, arr) => {
  const newList = [];
  for (let [idx, v] of arr.entries()) {
    if (predicateFn(v, idx, arr)) {
      newList.push(v);
    }
  }
  return newList;
};

const reduce = (reduceFn, ...args) => {
  let arr;
  let result;
  let startIndex = 0;

  if (args.length > 1) {
    [result, arr] = args;
  } else if (args.length > 0) {
    arr = args[0];
    result = arr[0];
    startIndex = 1;
  }

  for (let [idx, v] of arr.slice(startIndex).entries()) {
    result = reduceFn(result, v);
  }
  return result;
};

const unique = array => filter_((v, i, l) => l.indexOf(v) === i, array);

const flatten = (arr, depth = Infinity) =>
  arr.reduce((list,v) =>
    list.concat(depth > 0 ? Array.isArray(v) ? flatten(v, depth - 1) : v : [v]), []);

const flatMap =
    (mapperFn, arr) =>
        flatten(arr.map( mapperFn ), 1);

const zip = (arr1, arr2) => {
  const zipped = [];
  arr1 = [...arr1];
  arr2 = [...arr2];

  while (arr1.length > 0 && arr2.length > 0) {
    zipped.push([arr1.shift(), arr2.shift()]);
  }
  return zipped;
};

const composeChained = (...funcs) => result => 
  funcs.reduceRight((res, func) => {
    return func.call(res);
  }, result);

const invoker = (methodName, argLength) =>
  curry((...args) => {
    const obj = args.pop();
    return obj[methodName]( ...args);
  }, argLength);


const FP = {
  eq,
  gt,
  lt,
  rand,
  compose,
  compose2,
  pipe,
  pipe2,
  array,
  sum,
  filter,
  filter2: filter_,
  reduce,
  partial,
  partialRight,
  partialThis,
  curry,
  looseCurry: curry,
  uncurry,
  curryProps,
  partialProps,
  not,
  when,
  unary,
  binary,
  unique,
  flatten,
  flatMap,
  zip,
  map,
  composeChained,
  invoker,
};

module.exports = FP;
