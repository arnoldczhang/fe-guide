import Rx, {
  Observable,
  Scheduler,
} from'rxjs/Rx';

const btn = document.querySelector('#btn');

// const observer = Observable.fromEvent(btn, 'click')
//   .throttleTime(1000);
// const observer2 =observer
//   .map(e => e.clientX)
//   .scan((count, x, y, z) => {
//     return count + x;
//   }, 0);
// const observer3 = observer2.subscribe(count => console.log(`${count} times~`));









// const ob = Observable.create((observer) => {
//   observer.next(1);
//   observer.next(2);
//   observer.next(3);
//   setTimeout(() => {
//     observer.next(4);
//     observer.complete();
//     observer.next(5);
//   }, 1000);
// });

// ob.subscribe({
//   next(value) {
//     console.log(value);
//   },
//   complete() {
//     console.log('finished');
//   },
// });








// const ob2 = Observable.create((observer) => {
//   try {
//     observer.next(42);
//     observer.next(43);
//     observer.next(44);
//     observer.next(45);
//     observer.complete();
//   } catch (err) {
//     observer.error(err);
//   }
// });

// console.log('before');
// ob2.subscribe(x => console.log('x', x));
// ob2.subscribe(y => console.log('y', y));
// console.log('after');
console.log(Rx);















// Scheduler.async.schedule(val => console.trace(val), 1000, 'abc');

// console.log(observer, observer2, observer3);