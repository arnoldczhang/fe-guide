import {
  observable,
  // intercept,
  autorun,
} from "./mobx"

// let bankUser = observable({
//   name: '张三',
//   income: 3,
//   debit: 2,
//   date: [1991, 12, 5],
//   other: {
//     age: 100,
//   },
// });

// let bankUser = observable(new String('aa'));

// let bankUser = observable([1, 2, 3]);

// window.bankUser = bankUser;
// console.log(bankUser);

// autorun('aaaa', function() {
//   console.log('张三的账户存款:', bankUser.other.age);
// });

// bankUser.other.age = 10;
// bankUser.other.age = 11;
// bankUser.other.name = 'abc';
// bankUser.other = observable({ a: 'abc' });
// bankUser.other = { a: 'abc' };
// bankUser.other.a = 'aaa';
// console.log(bankUser.other);
// bankUser.other.age = 30191;


// console.log(bankUser);







class OrderLine {
    @observable price = 0;
    @observable amount = 1;

    // @computed get total() {
    //     return this.price * this.amount;
    // }
}


window.order = new OrderLine();