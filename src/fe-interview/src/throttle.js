
/**
 * 节流
 * @param  {[type]} func [description]
 * @param  {Number} wait [description]
 * @return {[type]}      [description]
 */
function throttle(func, wait = 300, isDebounce) {
  let pre = 0;
  let timer = null;
  return function() {
    const args = arguments;
    if (isDebounce) {
      if (timer) clearTimeout(timer);
      timer = setTimeout(() => {
        func.apply(this, [].slice.call(args));
        timer = null;
      }, wait);
    } else {
      const now = Date.now();
      if (now - pre < wait) return;
      func.apply(this, [].slice.call(args));
      pre = now;
    }
  };
};