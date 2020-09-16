/**
 * 题目：
 * 
 * 要求提供一个class，初始化后自动做节流请求
 * const queue = new Array(100); // 请求url队列
 * const max = 5; // 并行请求数
 * const roll = new Rolling(queue, max);
 * roll.start()
 * 
 */
class Rolling {
  constructor(q, max) {
    this.q = q;
    this.max = max;
    this.pending = 0;
  }
  
  start() {
      if (!this.q.length) {
        return this.stop();
      }
      while (this.pending <= this.max) {
        const reqUrl = this.q.shift();
        this.request(reqUrl);
        this.pending += 1;
      }
  }
  
  stop() {
    //
  }
  
  request(url) {
    fetch(url).then((res) => {
      this.pending -= 1;
      this.start();
    }).catch((err) => {
      this.pending -= 1;
      this.start();
    });
  }
}