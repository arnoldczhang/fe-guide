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
  filter2,
  reduce,
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
  unary,
  binary,
  unique: unique2,
  flatten,
  partialThis,
  composeChained,
  map,
  invoker,
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


// 二叉树深度
function depth(node) {
  if (node) {
    let depthLeft = depth( node.left );
    let depthRight = depth( node.right );
    return 1 + Math.max(depthLeft, depthRight);
  }
  return 0;
};

// PTC
function sumFunc(num1, num2, ...nums) {
  num1 = num1 + num2;
  if (nums.length === 0) return num1;
  return sumFunc(num1, ...nums);
};

// trampoline
function trampoline(fn) {
  return function trampolined(...args) {
    var result = fn( ...args );
    while (typeof result == "function") {
      result = result();
    }
    return result;
  };
};
var sum2 = trampoline(sumFunc);

var isOdd = v => v % 2 == 1;
var isEven = not(isOdd);
var filterIn = filter2;

function filterOut(predicateFn, arr) {
    return filterIn( not( predicateFn ), arr );
}

expect(isOdd(3)).to.be.equal(true);
expect(isEven(2)).to.be.equal(true);
expect(filterOut(isEven, [1,2,3,4,5] )).to.be.deep.equal([1,3,5]);
expect(filterIn(isOdd, [1,2,3,4,5] )).to.be.deep.equal([1,3,5]);

expect(reduce((res, v) => (res + v), [1, 2, 3])).to.be.equal(6);

function sum3 (a, b) {
  return a + b;
};

function double(a) {
  return a * 2;
}
var pipeReducer = binary( pipe );

var fn =
    [3,17,6,4]
    .map( v => n => v * n )
    .reduce( pipeReducer );

expect(unique2([1,4,7,1,3,1,7,9,2,6,4,0,5,3])).to.be.deep.equal([1, 4, 7, 3, 9, 2, 6, 0, 5]);
expect(flatten([[0,1],2,3,[4,[5,6,7],[8,[9,[10,[11,12],13]]]]])).to.be.deep.equal([0,1,2,3,4,5,6,7,8,9,10,11,12,13]);

expect(composeChained(
  partialThis(Array.prototype.reduce, sum3, 0),
  partialThis(Array.prototype.map, double),
  partialThis(Array.prototype.filter, isOdd)
)([1,2,3,4,5])).to.be.equal(18);

function aa () {
  const filter = invoker( "filter", 2 );
  const map = invoker( "map", 2 );
  const reduce = invoker( "reduce", 3 );

  return compose2(
    reduce(sum3)(0),
    map(double),
    filter(isOdd)
  )([1,2,3,4,5]);  
};
expect(aa()).to.be.equal(18);


var removeInvalidChars = str => str.replace( /[^\w]*/g, "" );

var upper = str => str.toUpperCase();

var elide = str =>
    str.length > 10 ?
        str.substr( 0, 7 ) + "..." :
        str;

var wordssss = "Mr. Jones isn't responsible for this disaster!".split( /\s/ );

expect(wordssss
  .map(
    pipe2( removeInvalidChars, upper, elide )
  )).to.be.deep.equal(['MR', 'JONES', 'ISNT', 'RESPONS...', 'FOR', 'THIS', 'DISASTER']);

expect(
  map(
    pipe2(removeInvalidChars, upper, elide),
    wordssss
  )
).to.be.deep.equal(['MR', 'JONES', 'ISNT', 'RESPONS...', 'FOR', 'THIS', 'DISASTER']);









