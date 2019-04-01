
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

function multiFn(a, b, c) {
    return a * b * c;
}

var multi = curry(multiFn);

console.log(multi(2)(3)(4));
console.log(multi(2,3,4));
console.log(multi(2)(3,4));
console.log(multi(2,3)(4));

