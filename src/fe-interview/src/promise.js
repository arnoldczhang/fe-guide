class MyPromise {
  constructor(callback) {
    this.status = this.#STATUS.pending;
    this.value = null;
    this.queue = [];
    this.errorQueue = [];
    callback(this.resolve.bind(this), this.reject.bind(this));
    return this;
  }

  #STATUS = {
    pending: 'pending',
    fullfilled: 'fullfilled',
    rejected: 'rejected',
  };

  execute() {
    switch (true) {
      case this.staue === this.#STATUS.pending:
        return;
      case this.value instanceof Error:
        while (this.errorQueue.length) {
          try {
            this.value = this.errorQueue.shift()(this.value);
            while (this.queue.length) {
              try {
                this.value = this.queue.shift()(this.value);
              } catch (err2) {
                break;
              }
            }
          } catch (err) {
            this.value = err;
          }
        }
        break;
      default:
        while (this.queue.length) {
          try {
            this.value = this.queue.shift()(this.value);
          } catch (err) {
            this.value = err;
            while (this.errorQueue.length) {
              try {
                this.value = this.errorQueue.shift()(this.value);
                break;
              } catch (err2) {
                err = err2;
              }
            }
          }
        }
        break;
    }
  }
  resolve(res) {
    if (this.status !== this.#STATUS.pending) return;
    this.status = this.#STATUS.fullfilled;
    this.value = res;
    this.execute();
  }
  reject(res) {
    if (this.status !== this.#STATUS.pending) return;
    this.status = this.#STATUS.rejected;
    this.value = res;
    this.execute();
  }
  then(callback, fallback) {
    this.queue.push(callback);
    fallback && this.errorQueue.push(fallback);
    this.execute();
    return this;
  }
  catch(fallback) {
    this.errorQueue.push(fallback);
    this.execute();
    return this;
  }
}

// test
const promise = new MyPromise((resolve, reject) => {
  resolve('a');
}).then((res) => {
  console.log(res);
  console.log(1);
  throw new Error();
}).catch(err => {
  console.log(2);
  return 3;
}).then(res => console.log(res));
