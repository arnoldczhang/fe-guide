/**
 * 可参考eventemitter3@5.0.1
 * 
 * - on/off/trigger/
 * 
 */
class EventEmitter {
  constructor() {
    this.cach = new Map();
  }

  on(event, handler) {
    if (!this.cach.has(event)) {
      this.cach.set(event, new Set());
    }
    const list = this.cach.get(event);
    if (typeof handler !== 'function') throw new Error('handler must be a function');
    if (list.has(handler)) return;
    list.add(handler);
  }

  off(event, handler) {
    if (!this.cach.has(event)) return;
    const list = this.cach.get(event);
    if (typeof handler === 'undefined') return list.clear();
    if (!list.has(handler)) return;
    list.delete(handler);
  }

  trigger(event, params) {
    if (!this.cach.has(event)) return;
    const list = this.cach.get(event);
    list.forEach((handler) => handler(params));
  }
}

// test
const emitter = new EventEmitter();

const handler1 = (e) => {
  console.log('handler1', e);
};

const handler2 = (e) => {
  console.log('handler2', e);
};

const handler3 = (e) => {
  console.log('handler3', e);
};

emitter.on('click', handler1);
emitter.on('click', handler2);
emitter.on('click', handler3);
emitter.trigger('click', 'try1: hello');
emitter.off('click', handler2);
emitter.trigger('click', 'try2: hello');
emitter.off('click');
emitter.trigger('click', 'try3: hello');

/**
 * ==第一次trigger==
 * handler1 try1: hello
 * handler2 try1: hello
 * handler3 try1: hello
 * 
 * ==第二次trigger==
 * handler1 try2: hello
 * handler3 try2: hello
 * 
 * ==第三次trigger==
 * 无
 */
