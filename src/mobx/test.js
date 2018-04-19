import {
  observable,
  // intercept,
  computed,
  autorun,
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
bankUser.other = { age: 'abc' };
bankUser.other.age = 30191;

let bankUser2 = observable(new String('aa'));

let bankUser3 = observable([1, 2, 3]);

window.bankUser = bankUser;


class OrderLine {
    @observable price = {
      detail: 100,
    };

    @observable amount = 5;

    @observable orderInfo = {
      orderId: {
        d: 1,
      },
    };

    @observable aa() {

    };

    @computed
    get priceAll() {
      return {
        a: this.price.detail * 10000,
      };
    }

    a = 1;

    // @computed get total() {
    //     return this.price * this.amount;
    // }
}

var orderline = new OrderLine();
window.orderline = orderline;

autorun(function() {
  console.log('订单号', orderline.orderInfo.orderId.d);
});

autorun(function() {
  console.log('价格', orderline.price.detail);
});

console.log(orderline);

orderline.price = { pp: 1 };
orderline.price = { detail: 101 };
orderline.price.detail = 200;
orderline.price.detail = 201;
orderline.price.detail = 202;
orderline.price.detail = 203;

orderline.orderInfo.orderId.d = 1;
orderline.orderInfo.orderId.d = 12;
orderline.orderInfo.orderId.d = 123;
orderline.orderInfo.orderId.d = 1234;




