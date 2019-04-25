/**
 * [Promise2 description]
 * @param {[type]} nextTick [description]
 */
function Promise2(nextTick) {
  this.nextTick = nextTick;
  this.resolve = this.resolve.bind(this);
  this.reject = this.reject.bind(this);
  if (typeof this.nextTick === 'function') {
    this.nextTick(this.resolve, this.reject);
  }
};

Promise2.resolve = function resolve() {
};

Promise2.prototype = {
  status: 'pending',
  resolve(data) {
    if (this.status === 'pending' && typeof this.callback === 'function') {
      this.status = 'fulfilled';
      const res = this.callback(data);
      if (typeof this.nextResolve === 'function') {
        this.thenResolve(res);
      }
    }
  },
  reject(data) {
    if (this.status === 'pending' && typeof this.fallback === 'function') {
      this.status = 'rejected';
      const rej = this.fallback(data);
    }
  },
  then(callback, fallback) {
    this.callback = callback;
    this.fallback = fallback;
    return new Promise2((resolve, reject) => {
      this.thenResolve = resolve;
      this.thenReject = reject;
    });
  },
};


// test
// const promise1 = new Promise2((resolve, reject) => {
//   debugger;
//   setTimeout(() => {
//     resolve(100);
//   }, 2000);
// });

// const promise2 = promise1.then((res) => {
//   console.log(res);
//   return res + 1000;
// });

// const promise3 = promise2.then((data) => {
//   console.log(data);
//   return data + 10000;
// });

// promise3.then((data) => {
//   console.log(data);
// });

