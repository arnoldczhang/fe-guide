class BasePromise {
  constructor(initialHandler) {
    this.STATUS = {
      pending: 'pending',
      fullfilled: 'fullfilled',
      rejected: 'rejected',
    };

    if (typeof initialHandler === 'function') {
      this.initialHandler = initialHandler;
    }
    this.status = this.STATUS.pending;
    this.callbackQueue = [];
    this.fallbackQueue = [];
  }
}
class MyPromise extends BasePromise {
  constructor(handler) {
    super(handler);
    this.#init();
    return this;
  }

  #init() {
    if (this.initialHandler) {
      this.initialHandler(this.#resolve.bind(this), this.#reject.bind(this));
    }
  }

  #resolve(res) {
    if (this.status !== this.STATUS.pending) return;
    this.status = this.STATUS.fullfilled;
    this.#runResolve(res);
  }

  #reject(err) {
    if (this.status !== this.STATUS.pending) return;
    this.status = this.STATUS.rejected;
    this.#runReject(err);
  }

  async #runResolve(res) {
    if (!this.callbackQueue.length) return;
    const callback = this.callbackQueue.shift();
    try {
      const result = await callback(res);
      this.#runResolve(result);
    } catch(err) {
      this.#runReject(err);
    }
  }

  async #runReject(err) {
    if (!this.fallbackQueue.length) return;
    const fallback = this.fallbackQueue.shift();
    try {
      const result = await fallback(err);
      this.#runResolve(result);
    } catch(err) {
      this.#runReject(err);
    }
  }

  then(handler, errorHandler) {
    if (typeof handler === 'function') {
      this.callbackQueue.push(handler);
    }

    if (typeof errorHandler === 'function') {
      this.fallbackQueue.push(errorHandler);
    }
    return this;
  }

  catch(errorHandler) {
    if (typeof errorHandler === 'function') {
      this.fallbackQueue.push(errorHandler);
    }
    return this;
  }
}

// test
const promise = new MyPromise((resolve, reject) => {
  setTimeout(() => {
    resolve('a');
  }, 3000);
}).then((res) => {
  console.log(res);
  console.log(1);
  throw new Error('hahaha');
}).catch(err => {
  console.log(err);
  console.log(2);
  return 3;
}).then(res => console.log(res));
