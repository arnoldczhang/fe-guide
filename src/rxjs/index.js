import Rx, {
  BehaviorSubject,
  ReplaySubject,
  Observable,
  Subject,
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
//     setTimeout(() => {
//       observer.next(45);
//     }, 1000);
//     observer.complete();
//   } catch (err) {
//     observer.error(err);
//   }
// });

// console.log('before');
// ob2.subscribe(x => console.log('x', x));
// const subscription = ob2.subscribe(y => console.log('y', y));
// subscription.unsubscribe();
// ob2.subscribe(z => console.log('z', z));
// console.log('after');



// const observer1 = Observable.interval(1000);
// const observer2 = Observable.interval(800);

// const subscription1 = observer1.subscribe(x => console.log(`x: ${x}`));
// const subscription2 = observer2.subscribe(y => console.log(`y: ${y}`));
// subscription1.add(subscription2);

// setTimeout(() => {
//   subscription1.unsubscribe();
// }, 2000);




// const subject = new Subject();
// const observer =  new Observable();

// subject.subscribe({
//   next: count => console.log(count),
// });
// subject.next(1);
// subject.next(2);
// subject.next(3);

// const source = Observable.from(['a', 'b', 'c']);
// source.subscribe(subject);
// source.subscribe(count => console.log(count));


// const source = Observable.from(['a', 'b', 'c']);
// const subject = new Subject();
// const multicast = source.multicast(subject);

// multicast.subscribe({
//   next: count => console.log(`A -> ${count}`),
// });

// const subscription = multicast.subscribe({
//   next: count => console.log(`B -> ${count}`),
// });
// subscription.unsubscribe();
// multicast.connect();


// const source = Observable.interval(1000);
// const multicast = source.multicast(new Subject).refCount();

// const m1 = multicast.subscribe(count => console.log(`A -> ${count}`));

// setTimeout(() => {
//   const m2 = multicast.subscribe(count => console.log(`B -> ${count}`));
//   setTimeout(() => {
//     m2.unsubscribe();
//   }, 2500);
// }, 1500);

// setTimeout(() => {
//   m1.unsubscribe();
// }, 5000);




const subject = new Subject();

subject.next(1);
subject.subscribe({
  next: count => console.log(count),
});
subject.next(2);
subject.next(3);


const behavior = new BehaviorSubject(0);
behavior.subscribe(count => console.log(`count A: ${count}`));
behavior.next(1);
behavior.next(2);
behavior.subscribe(count => console.log(`count B: ${count}`));
behavior.next(3);





// const subject = new ReplaySubject(3); // 为新的订阅者缓冲3个值

// subject.subscribe({
//   next: (v) => console.log('observerA: ' + v)
// });

// subject.next(1);
// subject.next(2);
// subject.next(3);
// subject.next(4);

// subject.subscribe({
//   next: (v) => console.log('observerB: ' + v)
// });

// subject.next(5);









console.log(Rx);















