
/**
 * 防抖
 * 
 * - 取最近触发
 * 
 * @param  {Function} fn        [description]
 * @param  {Number}   wait      [description]
 * @param  {Boolean}  immediate [description]
 * @return {[type]}             [description]
 */
function debounce(fn, wait = 300, immediate = false) {
  if (immediate) return fn;
  let timeout = null;
  return function() {
    if (timeout) {
      clearTimeout(timeout);
      timeout = null;
    }
    timeout = setTimeout(() => {
      fn.apply(this, [].slice.call(arguments));
      timeout = null;
    }, wait);
  };
};

// test
const fn = (a) => {
  console.log(a);
};
const dFn = debounce(fn, 1000);

dFn(1);
setTimeout(() => {
  // only log 2
  dFn(2);
}, 800);