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