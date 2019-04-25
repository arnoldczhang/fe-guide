
/**
 * [debounce description]
 * @param  {Function} fn        [description]
 * @param  {Number}   wait      [description]
 * @param  {Boolean}  immediate [description]
 * @return {[type]}             [description]
 */
function debounce(fn, wait = 300, immediate = false) {
  if (immediate) return fn;
  let timeout;
  return function() {
    if (timeout) {
      clearTimeout(timeout);
    }
    timeout = setTimeout(() => {
      fn.apply(this, [].slice.call(arguments));
    }, wait);
  };
};

// test
// function realFunc(){
//     console.log("Success");
// };

// const realFunc2 = debounce(realFunc);
// realFunc2();