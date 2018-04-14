import {
  observable,
  // intercept,
  autorun,
  // testDe,
} from "./mobx"

let bankUser = observable({
  name: '张三',
  income: 3,
  debit: 2,
  date: [1991, 12, 5],
  other: {
    age: 100,
  },
});

console.log(bankUser);

autorun('aaaa', function() {
  console.log('张三的账户存款:', bankUser.other.age);
});

bankUser.other.age = 10;
bankUser.other.age = 11;
bankUser.other.name = 'abc';
bankUser.other = observable({ a: 'abc' });
bankUser.other = { a: 'abc' };
bankUser.other.a = 'aaa';
console.log(bankUser.other);
bankUser.other.age = 30191;

let bankUser2 = observable(new String('aa'));
// console.log(bankUser2);

let bankUser3 = observable([1, 2, 3]);
// console.log(bankUser3);

window.bankUser = bankUser;


class OrderLine {
    @observable price = 12;

    @observable amount = 5;

    @observable orderInfo = {
      orderId: 123,
    };

    @observable aa() {

    }

    a = 1;

    // @computed get total() {
    //     return this.price * this.amount;
    // }
}

var orderline = new OrderLine();
window.orderline = orderline;

autorun(function() {
  console.log(111, orderline.amount);
});

autorun(function() {
  console.log(222, orderline.price);
});

console.log(1);





// console.log(bankUser);




// console.log(bankUser);


