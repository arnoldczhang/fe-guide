const chai = require('chai');
const colors = require('colors');
const expect = chai.expect;
const {
  rand,
  pipe,
  pipe2,
  compose,
  compose2,
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
expect(list2).to.be.deep.equal([4,5,6,7]);


// curry
const addThree = (x, y, z) => x + y + z;
const addCurry = curry(addThree);
const addCurry1 = addCurry(1);
const addCurry2 = addCurry1(2, 3);
expect(addCurry2).to.be.equal(6);

const adder = curry(add);
const list3 = list.map(adder(3));
expect(list3).to.be.deep.equal([4,5,6,7]);

const sumAll = (...nums) => {
    var total = 0;
    for (let num of nums) {
        total += num;
    }
    return total;
};

const curriedSum = curry( sumAll, 5 );
expect(curriedSum(1)(2, 3)(4, 5)).to.be.equal(15);

const curriedSum2 = curry( sumAll, 5 );
const unCurriedSum = uncurry(curriedSum2);
expect(unCurriedSum(1, 2, 3, 4, 5)).to.be.equal(15);
expect(unCurriedSum(1, 2, 3)(4)(5)).to.be.equal(15);

const sumAllObj = (nums) => {
    var total = 0;
    Object.values(nums).forEach((val) => {
        total += val;
    });
    return total;
};

const curriedSumObject = curryProps(sumAllObj, 3);
expect(curriedSumObject({ a: 1 })({ b: 2 })({ c: 3 })).to.be.equal(6);

const partialSumObject = partialProps(sumAllObj, { a: 1 });
expect(partialSumObject({ b: 2, c: 3 })).to.be.equal(6);


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


// compose2
const text = "To compose two functions together, pass the \
output of the first function call as the input of the \
second function call.";

const words = str => 
  String( str )
    .toLowerCase()
    .split(/\s|\b/)
    .filter(v => /^[\w]+$/.test( v ));

const unique = (list) => {
  const uniqList = [];
  for (let v of list) {
    if (uniqList.indexOf(v) === -1 ) {
      uniqList.push(v);
    }
  }
  return uniqList;
};

const skipShortWords = (words) => {
  const filteredWords = [];
  for (let word of words) {
    if (word.length > 4) {
      filteredWords.push(word);
    }
  }
  return filteredWords;
};

const skipLongWords = (words) => {
  const filteredWords = [];
  for (let word of words) {
    if (word.length <= 4) {
      filteredWords.push(word);
    }
  }
  return filteredWords;
};

const composeWord = partialRight(compose2, unique, words);
const skipShort = composeWord(skipShortWords);
const skipLong = composeWord(skipLongWords);
expect(skipShort(text)).to.be.deep.equal(["compose", "functions", "together", "output", "first",  "function", "input", "second"]);
expect(skipLong(text)).to.be.deep.equal(["to","two","pass","the","of","call","as"]);


// pipe2
const pipe2Word = partial(pipe2, words, unique, skipShortWords);
const pipe2Word2 = pipe2(words, unique, skipShortWords);
expect(pipe2Word()(text)).to.be.deep.equal(["compose", "functions", "together", "output", "first",  "function", "input", "second"]);
expect(pipe2Word2(text)).to.be.deep.equal(["compose", "functions", "together", "output", "first",  "function", "input", "second"]);


const prop = (key, obj) => {
  return obj[key];
}
const propID = partial(prop, "personId");
expect(propID({ personId: 'abc'})).to.be.equal('abc');


