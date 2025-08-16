/**
 * 题目：
 * 
 * 要求：处理异步、并发、回调、重试、边界、初始化后自动做节流请求
 * 要求提供一个class，初始化后自动做节流请求
 * const queue = new Array(100); // 请求url队列
 * const max = 5; // 并行请求数
 * const roll = new Rolling(queue, max);
 * roll.start()
 * 
 */
class Rolling {
  constructor(queue = [], parallel = 5, callback) {
    this.queue = queue;
    this.parallel = parallel;
    this.currentParallel = 0;
    this.pollingQueue = [];
    this.runnable = true;
    this.callback = callback;
  }

  async request(url = '') {
    if (typeof this.callback === 'function') {
      try {
        const result = await this.callback(url);
        console.log('success', result);
      } catch(err) {
        this.queue.unshift(url);
      } finally {
        this.currentParallel--;
        this.start();
        return;
      }
    }
    return new Promise((resolve, reject) => {
      Math.random() > 0.3 ? resolve(url) : reject(url);
    }).then((res) => {
      console.log('success', url);
    }, (err) => {
      console.log('fail', url);
      this.queue.unshift(url);
    }).finally(() => {
      this.currentParallel--;
      this.start();
    });
  }

  start() {
    if (!this.runnable) return;
    if (!this.queue.length) return;
    while (this.queue.length) {
      if (this.currentParallel >= this.parallel) return;
      const url = this.queue.shift();
      this.request(url);
      this.currentParallel += 1;
    }
  }

  stop() {
    this.runnable = false;
  }

  restart() {
    this.runnable = true;
    this.start();
  }
}

// test
const queue = new Array(100).fill().map(() => Math.random());
const max = 5; // 并行请求数
const roll = new Rolling(queue, max, async (res) => {
  await new Promise((resolve) => {
    setTimeout(resolve, 3333);
  });
  return res;
});
roll.start()


// 2025.4.28
class Rolling2 {
  constructor(queue, maxConcurrency = 5, maxRetry = 5) {
    this.queue = [...queue];
    this.maxConcurrency = maxConcurrency;
    this.concurrency = new Set();
    this.maxRetry = maxRetry;
    this.retryMap = new Map();
    this.runnable = true;
  }

  roll() {
    if (!this.runnable) return;
    if (!this.queue.length) return;
    if (this.concurrency.size >= this.maxConcurrency) return;
    const req = this.queue.shift()
    const promise = new Promise(async (resolve, reject) => {
      await this.callback(req, resolve, reject);
    });
    this.concurrency.add(promise);
    promise.catch((req) => {
      if (this.retryMap.has(req)) {
        const retry = this.retryMap.get(req);
        if (retry >= this.maxRetry) {
          console.log(`${req} 超出最大重试次数`);
          return;
        }
        this.retryMap.set(req, retry + 1);
      } else {
        this.retryMap.set(req, 1);
      }
      this.queue.unshift(req);
    }).finally(() => {
      this.concurrency.delete(promise);
      this.roll();
    });
  }

  start(callback) {
    this.callback = callback;
    while (this.concurrency.size < this.maxConcurrency) {
      this.roll();
    }
  }

  stop() {
    this.runnable = false;
  }

  restart() {
    this.runnable = true;
    this.roll();
  }
}
// test
// const queue = Array.from({ length: 100 }).map((_, idx) => `content_${idx}`);
// const roll = new Rolling2(queue, 5);
// roll.start((input, resolve, reject) => {
//   console.log(input);
//   setTimeout(() => {
//     if (/5$/.test(input)) {
//       reject(input);
//     } else {
//       resolve(input);
//     }
//   }, 1000);
// });