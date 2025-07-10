const STATUS = {
  pending: 'pending',
  fullfilled: 'fullfilled',
  rejected: 'rejected',
};

const isPromise = (item) => item instanceof _Promise;

// 方案一
function _Promise(fn) {
  if (typeof fn !== 'function') {
    throw new Error(`Promise resolver ${typeof fn} is not a function`);
  }
  this.status = STATUS.pending;
  this.result = undefined;
  this.queue = [];

  const runCallback = (index = 0) => {
    for (; index < this.queue.length; index += 1) {
      const [callback = finallyback,, finallyback] = this.queue[index];
      if (typeof callback !== 'function') continue;
      try {
        callback(this.result);
      } catch(err) {
        this.result = err;
        return runFallback(index + 1);
      }
    }
  };
  
  const runFallback = (index = 0) => {
    for (; index < this.queue.length; index += 1) {
      const [, fallback] = this.queue[index];
      if (typeof fallback !== 'function') continue;
      try {
        fallback(this.result);
        return runCallback(index + 1);
      } catch(err) {
        this.result = err;
      }
    }
  };

  const resolve = (res) => {
    if (this.status !== STATUS.pending) return;
    this.status = STATUS.fullfilled;
    this.result = res;
    runCallback();
  };

  const reject = (rej) => {
    if (this.status !== STATUS.pending) return;
    this.status = STATUS.rejected;
    this.result = rej;
    runFallback();
  };

  setTimeout(() => {
    try {
      fn(resolve, reject);
    } catch(err) {
      reject(err);
    }
  });
  return this;
}

_Promise.prototype.then = function then(callback, fallback) {
  this.queue.push([callback, fallback]);
  return this;
}

_Promise.prototype.catch = function promiseCatch(fallback) {
  this.queue.push([, fallback]);
  return this;
}

_Promise.prototype.finally = function promiseFinally(finallyback) {
  this.queue.push([,, finallyback]);
  return this;
}

_Promise.resolve = function resolve(res) {
  return new _Promise((resolve) => setTimeout(() => resolve(res)));
}
_Promise.reject = function reject(rej) {
  return new _Promise((resolve, reject) => setTimeout(() => reject(rej)));
}
_Promise.all = function all(array) {
  if (!Array.isArray(array) && typeof array !== 'string') {
    throw new TypeError(`${typeof array} is not iterable`);
  }

  if (typeof array === 'string') {
    array = array.split('');
  }
  return new _Promise((resolve, reject) => {
    const result = [];

    const checkResolve = () => {
      if (result.every(it => !isPromise(it))) {
        resolve(result);
      }
    };

    const iterate = (i, res) => {
      if (isPromise(res)) {
        return res.then(
          (r) => iterate(i, r),
          (err) => reject(err),
        );
      } else {
        result[i] = res;
      }
      checkResolve();
    };

    for (let i = 0; i < array.length; i += 1) {
      const item = array[i];
      if (isPromise(item)) {
        item.then((res) => {
          iterate(i, res);
        }, (err) => reject(err));
      }
      result[i] = item;
    }
    checkResolve();
  });
}
_Promise.race = function race() {}
_Promise.allSettled = function allSettled() {}
_Promise.any = function any() {}

// 方案二
class MyPromise {
  constructor(callback) {
    this.status = STATUS.pending;
    this.queue = [];
    this.errorQueue = [];
    callback(this.resolve.bind(this), this.reject.bind(this));
    return this;
  }
  resolve(res) {
    if (this.status !== STATUS.pending) return;
    this.status = STATUS.fullfilled;
    while (this.queue.length) {
      try {
        res = this.queue.shift()(res);
      } catch (err) {
        if (this.errorQueue.length) {
          return this.errorQueue.shift()(err);
        }
      }
    }
  }
  reject(res) {
    if (this.status !== STATUS.pending) return;
    this.status = STATUS.rejected;
    if (!this.errorQueue.length) return;
    return this.errorQueue.shift()(res);
  }
  then(callback, fallback) {
    this.queue.push(callback);
    fallback && this.errorQueue.push(fallback);
    return this;
  }
  catch(fallback) {
    this.errorQueue.push(fallback);
    return this;
  }
}

// test

/**
 * 1
c Error: aaa
 */
// new _Promise((resolve, reject) => {
//   reject(1);
// }).then((res) => {
//   console.log(res);
// }, (err) => {
//   console.log(err);
//   throw new Error('aaa');
// }).catch((err) => {
//   console.log('c', err);
// });

/**
 * c 1
2 Error: abc
3 Error: aaa
 */
// new _Promise((resolve, reject) => {
//   reject(1);
// }).catch((err) => {
//   console.log('c', err);
//   throw new Error('abc');
// }).then((res) => {
//   console.log(res);
// }, (err) => {
//   console.log('2', err);
//   throw new Error('aaa');
// }).then((res) => {
//   console.log(res);
// }, (err) => {
//   console.log('3', err);
// });

/**
 * c 1
2 Error: abc
3 Error: aaa
 */
// _Promise.reject(1).catch((err) => {
//   console.log('c', err);
//   throw new Error('abc');
// }).then((res) => {
//   console.log(res);
// }, (err) => {
//   console.log('2', err);
//   throw new Error('aaa');
// }).then((res) => {
//   console.log(res);
// }, (err) => {
//   console.log('3', err);
// });

/**
 * [ 1, 2, 3 ]
 */
// _Promise.all([1,2,3]).then((res) => console.log(res));

/**
 * [ 1, 2, 3, 444 ]
 */
// _Promise.all([1,2,3, _Promise.resolve(444)]).then((res) => console.log(res));
/**
 * 555
 */
// _Promise.all([1,2,3, _Promise.reject(555)]).catch((res) => console.log(res));