// 触发高频事件，且 N 秒内只执行一次
function throttle(fn, timeout = 1000) {
  let date = 0;
  return function throttle(...args) {
    if (Date.now() - date < timeout) return;
    fn.call(this, ...args);
    date = Date.now();
  }
}

// test

const log = (msg) => {
  console.log(msg);
};
const throttleFn = throttle(log);

// 只log1
throttleFn(1);
throttleFn(2);
throttleFn(3);
