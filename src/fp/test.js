const {
  rand,
  pipe,
  compose,
  array,
  filter,
  gt,
  lt,
  sum,
} = require('./fp');

const genMessage = (val) => `the sum is ${val}`;

const testArray = pipe(
  array(10),
  v => v.map(rand),
);

const filterArray = compose(
  filter(gt(15)),
  filter(lt(18)),
)(testArray);

const match = pipe([
  sum(filterArray),
  genMessage,
  console.log,
]);
