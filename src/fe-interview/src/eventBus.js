// 可参考eventemitter3@5.0.1
class EventEmitter {
  constructor() {
    this.eventMap = new Map();
  }

  on(event, callback, context, once = false) {
    if (typeof callback !== 'function') throw new Error('type error');
    const item = { callback, context, once };
    if (this.eventMap.has(event)) {
      const set = this.eventMap.get(event);
      set.add(item);
    } else {
      const set = new Set([item]);
      this.eventMap.set(event, set);
    }
  }
  once(event, callback, context) {
    return this.on(event, callback, context, true);
  }
  emit(event, ...params) {
    const set = this.eventMap.get(event);
    if (typeof set !== 'undefined') {
      set.forEach(({ callback, context, once }) => {
        if (typeof callback.call === 'function') {
          callback.call(context, ...params);
        } else {
          callback(...params);
        }
        if (once) this.off(event, callback);
      })
    }
  }
  off(event, callback) {
    const set = this.eventMap.get(event);
    if (typeof set === 'undefined') return;
    set.forEach((item) => {
      if (item.callback === callback) set.delete(item);
    });
  }
}

// test
var eventBus = new EventEmitter();

const eventCallback = (value) => {
  console.log(value);
};

const eventCallback2 = (value) => {
  console.log(value + 'aaaaa');
};

const eventCallback3 = (value) => {
  console.log(value + 'ccccc');
};


eventBus.on('click', eventCallback);
eventBus.on('click', eventCallback2);
eventBus.once('click', eventCallback3);
eventBus.emit('click', 'aaa');
eventBus.off('click', eventCallback);
eventBus.emit('click', 'bbb');