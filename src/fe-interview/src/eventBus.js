function EventEmitter() {
  this.cach = new Map();
}

EventEmitter.prototype.on = function on(type, callback) {
  let queue = this.cach.get(type);
  if (!queue) {
    queue = new Set([callback]);
    this.cach.set(type, queue);
  } else {
    queue.add(callback);
  }
}
EventEmitter.prototype.emit = function emit(type, ...args) {
  const queue = this.cach.get(type);
  if (queue) {
    queue.forEach((callback) => {
      callback(...args);
    });
  }
}
EventEmitter.prototype.off = function off(type, callback) {
  const queue = this.cach.get(type);
  if (queue) {
    queue.delete(callback);
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

eventBus.on('click', eventCallback);
eventBus.on('click', eventCallback2);
eventBus.emit('click', 'aaa');
eventBus.off('click', eventCallback);
eventBus.emit('click', 'bbb');

