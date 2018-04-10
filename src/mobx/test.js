import {
  observable,
  // intercept,
  autorun,
} from "./mobx"

const bankUser = observable({
  name: '张三',
  income: 3,
  debit: 2,
  date: [1991, 12, 5],
  other: {
    age: 100,
  },
});

// const bankUser = observable(new String('aa'));

window.bankUser = bankUser;
console.log(bankUser);

autorun(function() {
  // console.log('张三的账户存款:', bankUser.income);
  console.log('张三的账户存款:', bankUser.other.age);
});

// class Todo {
//     id = Math.random();
//     @observable title = "";
//     @observable finished = false;
//     @observable list = [];
// }