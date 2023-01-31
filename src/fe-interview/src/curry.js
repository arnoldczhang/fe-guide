
/**
 * [curry description]
 * @param  {[type]} func [description]
 * @return {[type]}      [description]
 */
function curry(func) {
  let remain = func.length;
  let args = [];
  return function curryInner() {
    const argLen = arguments.length;
    if (argLen) {
      args = args.concat([].slice.call(arguments));
      remain -= argLen;
      if (remain <= 0) {
        const finalArgs = args;
        remain = func.length;
        args = [];
        return func.apply(null, finalArgs);
      }
    }
    return curryInner;
  };
};

// 解法2
// es6
const curry2 = (fn, arr = []) => (...args) => (
  arg => arg.length === fn.length
    ? fn(...arg)
    : curry(fn, arg)
)([...arr, ...args]);

//
const curry3 = (fn, givenArgs = []) => {
  const { length } = fn;
  return (...args) => {
    givenArgs = givenArgs.concat(args);
    if (givenArgs.length >= length) {
      return fn(...givenArgs);
    }
    return curry(fn, givenArgs);
  };
};

// test
// function multiFn(a, b, c) {
//     return a * b * c;
// }

// var multi = curry(multiFn);

// console.log(multi(2)(3)(4));
// console.log(multi(2,3,4));
// console.log(multi(2)(3,4));
// console.log(multi(2,3)(4));

