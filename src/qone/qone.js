const qone = require('qone');


const list = [
  { name: 'a', age: 1, },
  { name: 'b', age: 2, },
  { name: 'c', age: 3, },
];

const result = qone({
  list,
}).query(`
  from item in list where item.age >= 2 select item
`);

console.log(result);