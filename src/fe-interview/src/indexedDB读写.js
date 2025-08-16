class ScriptCacher {
  constructor (dbName = 'test-db', version = 1, storeName = 'test-store') {
    this.dbName = dbName;
    this.version = version;
    this.storeName = storeName;
    this.tempStore = new Map();
    this.attemptStore = new Map();
  }

  MAX_ATTEMPT = 5
  /**
   * indexDb初始化步骤：
   * 1. 新建db（或复用db）
   * 
   */
  async init() {
    this.db = await this.openDB();
  }

  async openDB() {
    return new Promise((resolve, reject) => {
      const dbRequest = indexedDB.open(this.dbName, this.version);
      dbRequest.onupgradeneeded = (event) => {
        const db = event.target.result;
        if (!db.objectStoreNames.contains(this.storeName)) {
          db.createObjectStore(this.storeName, { keyPath: 'key' })
        }
      };

      dbRequest.onsuccess = (event) => {
        resolve(event.target.result);
      };

      dbRequest.onerror = (event) => {
        reject();
      }
    })
  }

  async loadScript(url) {
    const promise = new Promise((resolve, reject) => {
      const script = document.createElement('script');
      script.type = 'text/javascript';
      script.src = url;
      document.body.appendChild(script);
      script.onload = () => resolve();
      script.onerror = () => reject();
      setTimeout(() => document.body.removeChild(script), 0);
    });
    return promise;
  }

  countAttempt(url) {
    const count = this.getAttempt(url);
    this.attemptStore.set(url, count + 1);
  }

  getAttempt(url) {
    return this.attemptStore.get(url) || 0;
  }

  hasTempStore(url) {
    const promise = this.tempStore.has(url);
    if (!promise) return false;
    return promise;
  }

  async getTempStore(url) {
    const promise = this.tempStore.get(url);
    return promise.then((res) => res, () => {
      this.deleteTempStore(url);
      this.countAttempt(url);
      return this.loadAndRunTempStore(url);
    })
  }

  deleteTempStore(url) {
    this.tempStore.delete(url);
  }

  setTempStore(url = '', promise) {
    this.tempStore.set(url, promise)
  }

  async loadAndRunTempStore(url) {
    const attempt = this.getAttempt(url);
    if (attempt >= this.MAX_ATTEMPT) {
      return console.log(`${url} 加载失败，超过最大重试次数${this.MAX_ATTEMPT}`);
    }
    if (this.hasTempStore(url)) return await this.getTempStore(url);
    const promise = this.loadScript(url);
    this.setTempStore(url, promise);
    return await promise;
  }

  executeScript(content = '') {
    return new Promise((resolve, reject) => {
      // 使用Blob URL方式执行
      const blob = new Blob([content], { type: 'application/javascript' });
      const url = URL.createObjectURL(blob);
      
      const script = document.createElement('script');
      script.src = url;
      
      script.onload = () => {
        URL.revokeObjectURL(url);
        resolve();
      };
      
      script.onerror = (error) => {
        URL.revokeObjectURL(url);
        reject(error);
      };
      
      document.head.appendChild(script);
    });
  }

  async getCachFromDB(url) {
    return new Promise((resolve) => {
      const transaction = this.db.transaction(this.storeName);
      const store = transaction.objectStore(this.storeName);
      const request = store.get(url);
      request.onsuccess = (event) => {
        resolve(event.target.result?.data || null)
      };
      request.onerror = () => resolve(null)
    })
  }

  async setCachToDB(url = '', options) {
    return new Promise(async (resolve) => {
      const response = await fetch(url)
      if (!response.ok) resolve('')
      const script = await response.text();
      const transaction = this.db.transaction(this.storeName, 'readwrite');
      const store = transaction.objectStore(this.storeName);
      store.add({
        key: url,
        data: script,
        timestamp: Date.now(),
      })
      resolve(script);
    })
  }

  async loadAndRunDB(url, options) {
    const cachScript = await this.getCachFromDB(url);
    if (cachScript) {
      return this.executeScript(cachScript);
    }
    const script = await this.setCachToDB(url, options);
    return this.executeScript(script)
  }

  async loadAndRun(url = '', options = { ttl: 3600000 }) {
    if (!url) return;
    if (!this.db) return await this.loadAndRunTempStore(url, options);
    return await this.loadAndRunDB(url, options);
  }
}

// test

const init = async () => {
  const cache = new ScriptCacher()
  await cache.init()
  cache.loadAndRun('https://x.com/unpack/locale/2.12.18/dist/locale.umd.js')
  cache.loadAndRun('https://x.com/unpack/locale-vue/2.12.18/dist/index.umd.js')
}

init()