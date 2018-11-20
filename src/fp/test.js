const {
  rand,
  pipe,
  compose,
  array,
  filter,
  gt,
  lt,
  sum,
  partial,
  curry,
  uncurry,
  partialRight,
  curryProps,
  partialProps,
  not,
  when,
} = require('./fp');

// compose/pipe
const genMessage = (val) => `[compose/pipe] the sum is ${val}`;

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


// partial
const list = [1, 2, 3, 4];
const add = (pre, next) => {
  return pre + next;
};

list.map((val) => {
  return add(3, val);
});

const list2 = list.map(partial(add, 3));
console.log(`[partial] ${list2}`); // [4,5,6,7]


// curry
const addThree = (x, y, z) => x + y + z;

const addCurry = curry(addThree);

const addCurry1 = addCurry(1);
const addCurry2 = addCurry(2, 3);
console.log(`[curry] ${addCurry2}`); // 6

const adder = curry(add);
const list3 = list.map(adder(3));
console.log(`[curry] ${list3}`); // [4,5,6,7]

const sumAll = (...nums) => {
    var total = 0;
    for (let num of nums) {
        total += num;
    }
    return total;
};

const curriedSum = curry( sumAll, 5 );
console.log(`[curry] ${curriedSum( 1 )( 2, 3 )( 4, 5 )}`); // 15

const curriedSum2 = curry( sumAll, 5 );
const unCurriedSum = uncurry(curriedSum2);
console.log(`[curry] ${unCurriedSum(1, 2, 3, 4, 5 )}`); // 15
console.log(`[curry] ${unCurriedSum(1, 2, 3)(4)(5)}`); // 15

const sumAllObj = (nums) => {
    var total = 0;
    Object.values(nums).forEach((val) => {
        total += val;
    });
    return total;
};

const curriedSumObject = curryProps(sumAllObj, 3);
console.log(`[curry] ${curriedSumObject({ a: 1 })({ b: 2 })({ c: 3 })}`); // 6

const partialSumObject = partialProps(sumAllObj, { a: 1 });
console.log(`[curry] ${partialSumObject({ b: 2, c: 3 })}`); // 6


// not
const isShortEnough = (str) => {
  return str.length <= 5;
};

const isLongEnough = not(isShortEnough);

const str = 'abcdef';

const outputNot = (s) => console.log(`[not] ${s}`);

if (isLongEnough(str)) {
  outputNot(str); // abcdef
}

// when
const printIf = uncurry(partialRight(when, outputNot));
printIf(isLongEnough, str); // abcdef
printIf(isShortEnough, str); // 无输出




