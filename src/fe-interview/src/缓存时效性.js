/**
 * 缓存时效性
 * 
 * - 设置key后，一定时间内清除
 * - 重复设置时，重置清除时间
 * 
 */
class Cach {
  constructor() {
    this.cach = new Map();
    this.timeIdMap = new Map();
  }

  set(key, value, delay) {
    if (this.timeIdMap.has(key)) {
      clearTimeout(this.timeIdMap.get(key));
      this.timeIdMap.delete(key);
    }
    this.cach.set(key, value);
    const timeId = setTimeout(() => {
      this.cach.delete(key);
      this.timeIdMap.delete(key);
    }, delay);
    this.timeIdMap.set(key, timeId);
  }
  get(key) {
    if (this.cach.has(key)) return this.cach.get(key);
    return null;
  }
}

/**
 * 方式二：存储&时效一体
 */
class Cach {
  constructor() {
    this.cach = new Map();
  }
  set(key, value, timeout) {
    let timeoutId;
    if (this.has(key)) {
      [, timeoutId] = this.cach.get(key);
      if (timeoutId) clearTimeout(timeoutId);
    }
    timeoutId = setTimeout(() => {
      this.delete(key);
    }, timeout);
    this.cach.set(key, [value, timeoutId]);
  }
  has(key) {
    return this.cach.has(key);
  }
  delete(key) {
    this.cach.delete(key);
  }
  get(key) {
    return this.cach.has(key) ? this.cach.get(key)[0] : undefined;
  }
}

/**
 * test
 * 
 * 输出：
 * first 123
 * second time undefined
 * third time 123
 */
const cach = new Cach();
cach.set('a', 123, 1000);
console.log('first', cach.get('a'));
setTimeout(() => {
  console.log('second time', cach.get('a'));
}, 1500);
cach.set('a', 123, 1000);

setTimeout(() => {
  setTimeout(() => {
    cach.set('a', 123, 1000);
  }, 500);
  setTimeout(() => {
    console.log('third time', cach.get('a'));
  }, 1200);
}, 2000);