class PubSub {
  constructor() {
    this.cach = new Map();
  }

  publish(eventName, message) {
    if (!this.cach.has(eventName)) return;
    this.cach.get(eventName).forEach((callback) => {
      callback(message);
    });
  }

  subscribe(eventName, callback) {
    const list = this.cach.get(eventName) || [];
    list.push(callback);
    this.cach.set(eventName, list);
  }

  unsubscribe(eventName, callback) {
    if (!this.cach.has(eventName)) return;
    const list = this.cach.get(eventName);
    if (!list.includes(callback)) return;
    list.splice(list.indexOf(callback), 1);
  }
}

// test  
const pubsub = new PubSub();
const fn = data => console.log('Received data:', data);
// 订阅事件  
pubsub.subscribe('myEvent', fn);
// 发布事件  
pubsub.publish('myEvent', 'Hello, world!'); // 输出: Received data: Hello, world!  
// 取消订阅事件  
pubsub.unsubscribe('myEvent', fn);
// 再次发布事件，此时不会有输出，因为已经取消了订阅  
pubsub.publish('myEvent', 'Hello again!');