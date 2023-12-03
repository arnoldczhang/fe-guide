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