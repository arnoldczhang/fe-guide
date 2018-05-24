const esprima = require('esprima');
const babel = require('babel-core');
const signale = require('signale');
const chai = require('chai');
const expect = chai.expect;
console.log = signale.success;

// 求最大公约数
const gcd = (a, b) => {
  if (b > a) {
    [a, b] = [b, a];
  }

  if (!b) {
    return a;
  }
  return gcd(b, a % b);
};

// console.log(gcd(16, 28));
// console.log(gcd(206, 40));



// 帕斯卡三角
const paska = (line = 1, result = {}) => {
  line = line || 1;
  const preLine = result[line];

  let length;
  let nextLine;

  if (preLine) {
    length = preLine.length;
    nextLine = new Array(length + 1);
    for (let i = 0; i <= length; i += 1) {
      nextLine[i] = i ? preLine[i - 1] + (preLine[i] || 0) : 1;
    }
    result[--line] = nextLine;
  } else {
    result[--line] = [1];
  }

  if (line) {
    return paska(line, result);
  }
  return result;
};

// console.log(paska(8));





// 幂
const isEven = num => num % 2 === 0;
const isOdd = num => !isEven(num);
const square = num => num * num;
const cube = num => square(num) * num;
const expt = (num, times) => {
  if (times < 1) {
    return 1;
  }

  if (times === 1) {
    return num;
  }

  if (isEven(times)) {
    return square(expt(num, times / 2));
  } else {
    return num * square(expt(num, (times - 1) / 2))
  }
};

const expt2 = (num, times) => {
  if (times <= 1) {
    return num;
  }
  return num * expt2(num, --times);
};

// console.log(expt(2, 5));
// console.log(expt2(2, 5));





// 素数-寻找最小因子
const prime = (num) => {
  if (num < 3) return true;
  const min = 2;
  const max = Math.floor(Math.sqrt(num));
  for (let i = min; i <= max; i += 1) {
    if (!(num % i)) {
      return false;
    }
  }
  return true;
};

// console.log(prime(5));
// console.log(prime(12));
// console.log(prime(37));





// 素数-寻找最小因子-增强
const primeImprove = (num) => {
  if (num < 3) return true;
  const min = 2;
  const max = Math.floor(Math.sqrt(num));
  for (let i = min; i <= max; i += i === 2 ? 1 : 2) {
    if (!(num % i)) {
      return false;
    }
  }
  return true;
};
// console.log(primeImprove(10000));



// 费马小定理：如果n是素数，a为小于n的任意正整数，则a的n次方与a，模n同余
// TODO js精度问题，无法证实定理
const famaS = (num) => {
  num = parseInt(num);
  if (prime(num)) {
    if (num === 1) return true;
    for (let a = 1; a < num; a += 1) {
      if (expt2(a, num) % num !== a % num) {
        return false;
      }
    }
    return true;
  }
  return 'is not prime';
};
// console.log(famaS(561));
// console.log(famaS(1105));





// 找素数花费时间
const searchPrimeTime = (func, range = [0, 1]) => {
  let globalStartTime = Date.now();
  let [start = 0, end = 1] = range;
  const result = {};
  if (end < start) {
    [start, end] = [end, start];
  }

  let startTime = Date.now();
  for (let i = start ; i < end; i += 1) {
    if (func(i)) {
      result[i] = Date.now() - startTime;
      startTime = Date.now();
    }
  }
  return {
    name: func.name,
    // result,
    cost: Date.now() - globalStartTime,
  };
};

// console.log(searchPrimeTime(primeImprove, [, 100000]));
// console.log(searchPrimeTime(prime, [, 100000]));





// 高阶函数-过程作为参数
const sum = (term, start = 0, next, end = 0) => {
  let result = 0;
  if (start > end) {
    return result;
  }

  for (let i = start; i <= end; ) {
    result += term(i);
    i = next(i);
  }
  return result;
};

const increment = num => num += 1;
const pow = num => Math.pow(num, 3);
const identity = num => num;

const sumIncrement = (start, end) => sum(pow, start, increment, end);
const sumIdentity = (start, end) => sum(identity, start, increment, end);

// console.log(sumIncrement(1, 10));
// console.log(sumIdentity(1, 10));




// production
const iter = (min = 1, max = 2, end = 10) => max >= end ? 1 : min / max * iter(max + 1, min + 1, end);
const production = (start = 2, end = 10) => iter(start, start + 1, end);
// console.log(production(2, 9));





// 不动点f(x) === x
const fixPoint = (func, input = 1, tolerance = 0.0001) => {
  const result = func(input);
  if (Math.abs(result - input) <= tolerance) {
    return result;
  }
  return fixPoint(func, result, tolerance);
};

// console.log(fixPoint(Math.cos, 1, 0.0000001)); // 余弦不动点
// console.log(fixPoint(x => Math.sin(x) + Math.cos(x), 1));
// console.log(fixPoint(x => 1 + 1 / x, 1)); // 黄金分割数1.618





const average = (num1, num2) => (num1 +num2) / 2;
const averageFunc = func => num => average(num, func(num));

// 平均阻尼
const averageDump = averageFunc(square);

// 求平方根
const sqrt = x => fixPoint(averageFunc(y => x / y), 1);

// 求立方根
const cubert = x => fixPoint(averageFunc(y => x / square(y)), 1);
// console.log(averageDump(10)); //55
// console.log(sqrt(10)); // 3.1622
// console.log(sqrt(100));
// console.log(cubert(100));


// 求导数
const deriv = func => (num, dx = 0.0001) => (func(num + dx) - func(num)) / dx;
// 求x -> x^3的导数（3x^2）
const derivCube = deriv(cube);
// console.log(derivCube(5));




// 求平方根（牛顿法）
const newtonTransform = func => num => num - func(num) / deriv(func)(num);
const newTonMethod = (func, guess = 1) =>  fixPoint(newtonTransform(func), guess);
// y -> y^2 - x
const sqrt2 = x => newTonMethod(y => square(y) - x);
// console.log(sqrt2(100));






// 第一级抽象：最少限制元素
const fixPointTransform = (func, transform, guess = 1) => fixPoint(transform(func), guess);

// 求平方根（平均阻尼不动点-第一级抽象）
const sqrt3 = x => fixPointTransform(y => x / y, averageFunc);

// 求平方根（牛顿法-第一级抽象）
const sqrt4 = x => fixPointTransform(y => square(y) - x, newtonTransform);
// console.log(sqrt3(100));
// console.log(sqrt4(100));

// 求立方根
const cubert2 = x => fixPointTransform(y => x / square(y), averageFunc);
// console.log(cubert2(100));

// x^3 + ax^2 + bx + c
const newTonCubic = (a, b, c) => newTonMethod(x => cubert2(x) + a * sqrt3(x) + b * x + c);



// f(g(x))
const compose = (f, g) => x => f(g(x));
// (x + 1)^2
const squareInc = compose(square, x => x + 1);
// console.log(squareInc(6)); // 49

// x^2^n
const repeated = x => expt(5, x);
const squareN = x => expt(2, x);
const squareRepeat = compose(repeated, squareN);
// console.log(squareRepeat(2)); // 625




// 有理数运算
const divide = (x, y) => {
  if (y) {
    return x / y;
  }
  throw new Error('the denor can`t be zero');
};
const multi = (x, y) => x * y;
const minus = (...args) => args.reduce((x = 0, y = 0) => x - y);
const add = (...args) => args.reduce((x = 0, y = 0) => x + Number(y), 0);
const min = (...args) => Math.min.apply(null, args);
const max = (...args) => Math.max.apply(null, args);

const getRat = (x, options = {}) => {
  let num = x;
  let times = 1;
  while (num % 1) {
    times *= 10;
    num = x * times;
  }

  if (options.toInt) {
    return `${num}/${times}`;
  }

  return {
    numer: num,
    denom: times,
  };
};

/**
 * 抽象屏障
 */

// 1-序对
const cons = divide;
const car = x => getRat(x).numer;
const cdr = x => getRat(x).denom;
// 2-分子分母有理数
const makeRat = (x, y) => cons(x, y);
const numer = x => car(x);
const denom = x => cdr(x);
// 3-有理数操作
const addRat = (x, y) => divide(
  add(
    multi(numer(x), denom(y)),
    multi(numer(y), denom(x)),
  ),
  multi(denom(x), denom(y)),
);
const multRat = (x, y) => divide(
  multi(
    numer(x),
    numer(y),
  ),
  multi(
    denom(x),
    denom(y),
  ),
);

// console.log(addRat(0.8, 0.3));
// console.log(addRat(0.05, 0.3));
// console.log(multRat(0.8, 0.3));
// console.log(multRat(0.05, 0.3));




const oneHalf = makeRat(1, 2);
const oneThird = makeRat(1, 3);

// console.log(addRat(oneHalf, oneThird));// 5 / 6
// console.log(multRat(oneHalf, oneThird));// 1 / 6
// console.log(addRat(oneThird, oneThird));// 6 / 9


const makeRat2 = (x, y) => {
  const g = gcd(x, y);
  if (divide(x, y) < 0) {
    x = -Math.abs(x);
    y = Math.abs(y);
  }
  return cons(divide(x, g), divide(y, g));
};

const oneHalf2 = makeRat2(1, 2);
const oneThird2 = makeRat2(1, 3);

// console.log(addRat(oneHalf2, oneThird2));// 5 / 6
// console.log(multRat(oneHalf2, oneThird2));// 1 / 6
// console.log(addRat(oneThird2, oneThird2));// 6 / 9


const numer2 =  (x) => {
  const g = gcd(car(x), cdr(x));
  return car(x) / g;
};
const denom2 =  (x) => {
  const g = gcd(car(x), cdr(x));
  return cdr(x) / g;
};
// console.log(numer2(0.8));
// console.log(denom2(0.8));

// 线段
class Segment {
  constructor(...args) {
    const argsLength = args.length;
    if (!argsLength) {
      return;
    }

    const {
      start,
      end,
    } = this;
    const iterateArray = [start, end];
    const iterator = argsLength === 1 ? args[0] : args;

    this.checkStatus('isAllArray', iterator);
    iterator.length = 2;
    iterator.forEach((item, index) => {
      iterateArray[index].apply(this, item);
    });
  }

  start(x, y) {
    if (this.begin) {
      return;
    }
    this.begin = true;
    this.startX = x;
    this.startY = y;
  }

  end(x, y) {
    if (this.ended) {
      return;
    }
    this.ended = true;
    this.endX = x;
    this.endY = y;
  }

  checkStatus(status, input) {
    switch(status) {
      case 'completed':
        const completed = this.begin && this.ended;
        if (completed) {
          return true;
        }
        throw new Error('the line is not completed');
      case 'isAllArray':
        const isAllArray = input && Array.isArray(input) && input.every(item => Array.isArray);
        if (isAllArray) {
          return true;
        }
        throw new Error(`${input} is not all array`);
      default:
        break;
    }
  }

  getMiddlePoint() {
    this.checkStatus('completed');
    return [
      divide(add(this.endX, this.startX), 2),
      divide(add(this.endY, this.startY), 2)
    ];
  }

  getStartPoint() {
    return [this.startX, this.startY];
  }

  getEndPoint() {
    return [this.endX, this.endY];
  }

  getLength() {
    this.checkStatus('complete');
    return sqrt3(
      add(
        square(minus(this.startX, this.endX)),
        square(minus(this.startY, this.endY)),
      )
    );
  }
}

// const segment = new Segment;
// segment.start(1, 1);
// segment.end(2, 2);
// console.log(segment.getMiddlePoint());
// console.log(segment.getLength());

// const segment2 = new Segment([1, 1], [2, 2]);
// console.log(segment2.getMiddlePoint());
// console.log(segment2.getLength());

// const segment3 = new Segment([[1, 1], [2, 2]]);
// console.log(segment3.getMiddlePoint());
// console.log(segment3.getLength());

// const segment4 = new Segment([[1, 1]]);
// segment4.end(2, 2);
// console.log(segment4.getMiddlePoint());
// console.log(segment4.getLength());

class Rect {
  constructor() {

  }
}

// const rat = makeRat2(1, 2);
// console.log(numer(rat) / denom(rat) === rat);


const cons2 = (x, y) => (m) => [x, y][m];
const z = cons2(1, 5);
const car2 = z(0);
const cdr2 = z(1);
// console.log(car2, cdr2);


const countAdd = (x = 0) => ++x;
const addL = (func, times) => {
  let result = 0;
  while (times--) {
    result = func(result);
  }
  return result;
};
const one = x => addL(countAdd, 1);
// console.log(addL(countAdd, 5));


// 区间算数
const lowerBound = interval => interval[0];
const upperBound = interval => interval[1];
const makeInterval = (x, y) => [x, y];
// 区间相加
const addInterval = (x, y) => makeInterval(
  add(lowerBound(x), lowerBound(y)),
  add(upperBound(x), upperBound(y)),
);
// 相减
const subInterval = (x, y) => makeInterval(
  minus(lowerBound(x), lowerBound(y)),
  minus(upperBound(x), upperBound(y)),
);
// 相乘
const mulInterval = (x, y) => {
  const lowerX = lowerBound(x);
  const lowerY = lowerBound(y);
  const upperX = upperBound(x);
  const upperY = upperBound(y);
  const mArray = [
    multi(lowerX, lowerY),
    multi(lowerX, upperY),
    multi(upperX, lowerY),
    multi(upperX, upperY),
  ];
  return makeInterval(
    min.apply(null, mArray),
    max.apply(null, mArray),
  );
};
// 相除
const divInterval = (x, y) => mulInterval(
  x,
  makeInterval(
    divide(1, lowerBound(y)),
    divide(1, upperBound(y)),
  ),
);

const getIntervalWidth = x => divide(upperBound(x) - lowerBound(x), 2);
const intv1 = [1, 2];
const intv2 = [3, 4];
// console.log(addInterval(intv1, intv2));
// console.log(subInterval(intv1, intv2));
// console.log(mulInterval(intv1, intv2));
// console.log(divInterval(intv1, intv2));
// console.log(getIntervalWidth(addInterval(intv1, intv2)) === add(getIntervalWidth(intv1), getIntervalWidth(intv2)));

// 按需相乘
const mulInterval2 = (x, y) => {
  let interval = new Array(2);
  const lowerX = lowerBound(x);
  const lowerY = lowerBound(y);
  const upperX = upperBound(x);
  const upperY = upperBound(y);

  switch(
    Number(lowerX > 0 && 1)
      | Number(lowerY > 0 && 2)
      | Number(upperX > 0 && 4)
      | Number(upperY > 0 && 8)
  ) {
    case 0:
      interval[0] = multi(upperX, upperY);
      interval[1] = multi(lowerX, lowerY);
      break;
    case 4:
      interval[0] = multi(lowerY, upperX); 
      interval[1] = multi(lowerX, lowerY); 
      break;
    case 8:
      interval[0] = multi(lowerX, upperY); 
      interval[1] = multi(lowerX, lowerY);
      break;
    case 10:
      interval[0] = multi(lowerX, upperY); 
      interval[1] = multi(lowerY, upperX);
      break;
    case 12:
      interval[0] = min.apply(null, [multi(lowerX, upperY), multi(lowerY, upperX)]);
      interval[1] = max.apply(null, [multi(upperX, upperY), multi(lowerX, lowerY)]);
      break;
    case 13:
      interval[0] = multi(upperX, lowerY);
      interval[1] = multi(upperX, upperY);
      break;
    case 14:
      interval[0] = multi(upperY, lowerX);
      interval[1] = multi(upperX, upperY);
      break;
    case 15:
      interval[0] = multi(lowerX, lowerY);
      interval[1] = multi(upperX, upperY);
      break;
  }
  return makeInterval.apply(null, interval);
};

// console.log(mulInterval2([1, 2], [3, 4]));
// console.log(mulInterval2([-1, 2], [3, 4]));
// console.log(mulInterval2([-1, 2], [-3, 4]));
// console.log(mulInterval2([-1, 2], [-4, -3]));
// console.log(mulInterval2([-2, -1], [3, 4]));
// console.log(mulInterval2([-2, -1], [-3, 4]));
// console.log(mulInterval2([-2, -1], [-4, -3]));



const makeCenterInterval = (x, width) => makeInterval(minus(x, width), add(x,width));
const getCenter = x => divide(add(lowerBound(x), upperBound(x)), 2);
const getWidth = getIntervalWidth;
const makeCenterPercent = (center, percent) => [
  minus(center, multi(center, percent)),
  add(center, multi(center, percent)),
];
const gerPercent = (interval) => {
  const center = getCenter(interval);
  return divide(minus(upperBound(interval), center), center);
};
// console.log(makeCenterPercent(3, 0.5));
// console.log(gerPercent([1.5, 4.5]));


const R1 = 4;
const R2 = 5;
// console.log(divide(multi(R1, R2), add(R1, R2)));
// console.log(divide(one(), add(divide(one(), R1), divide(one(), R2))));









// 序列
const listify = (...args) => {
  if (!args.length) {
    return null;
  }

  if (args.length === 1) {
    return args.shift();
  }
  return [args.shift(), listify.apply(null, args)];
};
const flatten = (list, res = []) => {
  if (list) {
    if (list.length) {
      let first = list[0];
      if (Array.isArray(first)) {
        flatten(first, res);
      } else {
        res.push(first);
      }
      return flatten(list[1], res);
    }
    res.push(list);
  }
  return res;
};
const listCons = (el, list) => (
  el ? list ? [el, list] : el : list
);
const listCar = list => list && list.length ? list[0] : list;
const listCdr = (list, noFlatten) => {
  if (list) {
    if (list.length > 1) {
      if (noFlatten) {
        return list[1];
      }
      return flatten(list[1]);
    }
    return list[0];
  }
  return null;
};
const oneThroughFour = () => listify(1, 2, 3, 4);
// console.log(listify(1,2,3));
// console.log(oneThroughFour());
// console.log(listCar(oneThroughFour()));
// console.log(listCdr(oneThroughFour()));
// console.log(listCar(listCdr(oneThroughFour())));
// console.log(listCons(10, oneThroughFour()));
// console.log(listCons(5, oneThroughFour()));


const listRef = (list, index) => {
  if (list && list.length) {
    if (!index) {
      return listCar(list);
    }
    return listCdr(list)[index - 1];
  }
  throw new Error('miss the list');
};
const listOdd = () => listify(1, 3, 5, 7);
const listSqures = () => listify(1, 4, 9, 16, 25);
// console.log(listRef(listSqures(), 3));


const listLength = list => !list ? 0 : (listCdr(list).length + 1);
// console.log(listLength(listOdd())); // 4

const listAppend = (list1, list2) => {
  if (!list1) {
    return list2;
  }
  return listCons(listCar(list1), listAppend(listCdr(list1, true), list2));
};
// console.log(JSON.stringify(listAppend(listOdd(), listSqures())));

const listLastPair = (list) => {
  const cdrList = listCdr(list);
  return cdrList[cdrList.length - 1];
};
// console.log(listLastPair(listOdd()));
// console.log(listLastPair(listSqures()));

const listReverse = (list) => {
  list = flatten(list);
  return listify.apply(null, list.reverse());
};
// console.log(listReverse(listOdd()));


// 算硬币
const getMap = (list) => (list.reduce((map, value, index) => {
  map[index + 1] = value;
  return map;
}, {}));
const usCoins = () => getMap([50, 25, 10, 5, 1]);
const ukCoins = () => getMap([100, 50, 20, 10, 5, 2, 1, 0.5]);
const listCC = (
  amount,
  coinList,
  kind = Object.keys(coinList).length,
) => {
  if (!amount) {
    return 1;
  }

  if (amount < 0 || kind === 0) {
    return 0;
  } else {
    return listCC(amount, coinList, kind - 1) + listCC(amount - coinList[kind], coinList, kind);
  }  
};
// console.log(listCC(100, usCoins())); // 292
// console.log(listCC(100, ukCoins()));

// 序列循环
const listScale = (list, factor) => (
  list
    ? listCons(listCar(list) * factor, listScale(listCdr(list, true), factor))
    : null
);
// console.log(JSON.stringify(listScale(listify(1, 2, 3, 4, 5), 10)));


const listMap = (proc, list) => (
  list
    ? listCons(proc(listCar(list)), listMap(proc, listCdr(list, true)))
    : null
);
const listForEach = (proc, list) => {
  if (list) {
    proc(listCar(list));
    listForEach(proc, listCdr(list, true));
  }
};
const listScale2 = (list, factor) => listMap(x => x * factor, list);
const listSquare = (list, factor) => listMap(square, list);
// console.log(listMap(Math.abs, listify(-1, 2, -3, 4)));
// console.log(listMap(x => x * x, listify(-1, 2, -3, 4)));
// console.log(listScale2(listify(-1, 2, -3, 4), 10));
// console.log(listSquare(listify(-1, 2, -3, 4)));
// listForEach(x => console.log(x), listify(1, -2, 3, 4));
// console.log(listReverse(listify(listify(1, 2), listify(3, 4))));

const listX = () => listify(listify(1, 2), listify(3, 4));
const fringe = list => flatten(list);
const makeMobile = (left, right) => listify(left, right);
// console.log(fringe(listX()));
// console.log(fringe(listify(listX(), listX())));

const listMapDeep = (proc, list) => {
  if (list) {
    if (Array.isArray(listCar(list))) {
      return listCons(
        listMapDeep(proc, listCar(list)),
        listMapDeep(proc, listCdr(list, true)),
      );
    }
    return listCons(
      proc(listCar(list)),
      listMapDeep(proc, listCdr(list, true)),
    );
  }
  return null;
};
const listSquareDeep = list => listMapDeep(square, list);
// console.log(listMapDeep(x => x * 10, ));
// [10,[[20,[[30,40],50]],[60,70]]]
// console.log(JSON.stringify(listSquareDeep(listify(1, listify(2, listify(3, 4), 5), listify(6, 7)))));


const sumOddSqures = (list) => {
  let result = 0;
  listForEach((value) => {
    if (isOdd(value)) {
      result += square(value);
    }
  }, list);
  return result;
};

const sumOddSqures2 = (list) => {
  if (list && list.length) {
    return list.reduce((count, value) => {
      if (Array.isArray(value)) {
        return count + sumOddSqures2(value);
      }
      return count + (isOdd(value) ? square(value) : 0);
    }, 0);
  }
  return 0;
};

// console.log(sumOddSqures(listify(1, 2, 3, 4, 5)));
// console.log(sumOddSqures2(listify(1, 2, 3, 4, 5)));

// 信号流
const listFilter = (predicate, list) => {
  if (list) {
    if (Array.isArray(list)) {
      let car = listCar(list);
      if (predicate(car)) {
        return listCons(car, listFilter(predicate, listCdr(list, true)));
      }
      return listFilter(predicate, listCdr(list, true));
    }
    return list;
  }
  return null;
};

const listAccumulate = (op, initValue, list) => {
  if (list) {
    if (Array.isArray(list)) {
      initValue = op(initValue, listCar(list));
      return listAccumulate(op, initValue, listCdr(list, true));
    }
    return op(initValue, list);
  }
  return 0;
};
// console.log(listFilter(isOdd, listify(1, 2, 3, 4, 5))); // [ 1, [ 3, 5 ] ]
// console.log(listAccumulate(add, 0, listify(1, 2, 3, 4, 5))); // 15
// console.log(listAccumulate(multi, 1, listify(1, 2, 3, 4, 5))); // 120
// console.log(JSON.stringify(listAccumulate(listCons, null, listify(1, 2, 3, 4, 5)))); // [[[[1,2],3],4],5]


// 区间整数序列
const enumerableInterval = (low, high) => {
  if (low > high) {
    return null;
  }
  return listCons(low, enumerableInterval(low + 1, high));
};
// console.log(JSON.stringify(enumerableInterval(1, 4)));

const sumOddSqures3 = (list) => listAccumulate(
  add,
  0,
  listMapDeep(
    square,
    listFilter(isOdd, list),
  ),
);
// console.log(sumOddSqures3(listify(1, 2, 3, 4, 5)));

const listEvenFibs = high => (
  listAccumulate(listCons, null, listFilter(isEven, enumerableInterval(0, high)))
);
// console.log(JSON.stringify(listEvenFibs(10)));

// 斐波那契数
const getFibs = (high, list = [0, 1]) => {
  const length = list.length;
  const next = list[length - 2] + list[length - 1];
  if (length > high) {
    return list;
  }
  list.push(next);
  return getFibs(high, list);
};
// console.log(getFibs(10)); // [ 0, 1, 1, 2, 3, 5, 8, 13, 21, 34, 55 ]

// 斐波那契数-平方
const listFibSquare = high => listMap(square, listify.apply(null, getFibs(high)));
// console.log(JSON.stringify(listFibSquare(10))); // [1,[1,[4,[9,[25,[64,[169,[441,[1156,3025]]]]]]]]]

// 奇数平方积
const productOddSquare = list => listAccumulate(multi, 1, listMap(square, listFilter(isOdd, list)));
// console.log(productOddSquare(listify(1, 2, 3, 4, 5))); // 225

// 多项式
const hornerEval = (x, list) => {
  const op = (() => {
    let times = 0;
    return (count, next) => {
      return add(count, multi(next, expt(x, times++)));
    };
  })();
  return listAccumulate(op, 0, list);
};
// 设x = 2, 求1 + 3x + 5x^3 + x^5
// console.log(hornerEval(2, listify(1, 3, 0, 5, 0, 1))); // 79


const countLeaves = list => listAccumulate((count, next) => {
  return add(count, 1);
}, 0, list);
// console.log(countLeaves(listify(1, 2, 3, 4, 5))); // 5


const foldLeft = (op, initValue, list) => {
    const iter = (init, array) => {
      if (array && array.length) {
        return iter(op(init, listCar(array)), listCdr(array, true));
      }
      return op(init, array);
    };
    return iter(initValue, list);
};
// console.log(foldLeft(add, 0, listify(1, 2, 3, 4, 5))); // 15


const listifyRight = (...args) => {
  if (args.length) {
    return args.reduce((result, value, index) => {
      if (index < 2) {
        result.push(value);
        return result;
      }
      return [result, value];
    }, []);
  }
  return null;
};

const foldRight = (op, initValue, list) => {
  if (list && list.length) {
    let suffix = list.pop();
    while (Array.isArray(suffix)) {
      list = suffix;
      suffix = suffix.pop();
    }
    initValue = op(initValue, suffix);
    return foldRight(op, initValue, list);
  }
  return initValue;
};
// console.log(JSON.stringify(listifyRight(1, 2, 3, 4, 5))); // [[[[1,2],3],4],5]
// console.log(foldRight(add, 0, listifyRight(1, 2, 3, 4, 5))); // 15
// console.log(foldLeft(divide, 1, listify(1, 2, 3)));
// console.log(foldRight(divide, 1, listifyRight(1, 2, 3)));
// console.log(foldLeft(listify, null, listify(1, 2, 3))); // [ [ [ null, 1 ], 2 ], 3 ]
// console.log(foldRight(listifyRight, null, listifyRight(1, 2, 3))); // [ [ [ null, 3 ], 2 ], 1 ]
// console.log(foldLeft(add, null, listify(1, 2, 3))); // 6
// console.log(foldRight(add, null, listifyRight(1, 2, 3))); // 6

// 自然序对和为素数（i <= n，j < i，i + j是素数）
const getCountPrime = (n, result = []) => {
  const list = enumerableInterval(2, n);
  listForEach((item) => {
    const childList = enumerableInterval(1, item);
    listForEach((child) => {
      const sum = child + item;
      if (prime(sum)) {
        result.push([item, child, sum]);
      }
    }, childList);
  }, list);
  return result;
};

const primeSum = list => list.reduce((sum, next) => sum + next[2], 0);
// 过滤序列字段
const removeSeq = (removeItem, list) => listFilter(item => removeItem !== item, list);
// console.log(JSON.stringify(getCountPrime(6))); // [[2,1,3],[3,2,5],[4,1,5],[4,3,7],[5,2,7],[6,1,7],[6,5,11]]
// console.log(primeSum(getCountPrime(6)));
// console.log(removeSeq(3, listify(1, 2, 3, 4, 5)));


// 排列组合
const permutation = (list) => {
  // n(n-1)(n-2)……(n-m+1)
  if (list) {
    if (!list.length) {
      list = [list];
    }
    list = flatten(list);
    let result = 1;
    let length = list.length;
    while (length) {
      result = multi(result, length--);
    }
    return result;
  }
  return 0;
};
// console.log(permutation(listify(1, 2, 3, 4)));
// console.log(permutation(listify(1, 2, 3)));
// console.log(permutation(listify(1, 2)));
// console.log(permutation(listify(1)));


// TODO 画家 + 向量这块没看懂。。。。
const makeVect = (x, y) => [x, y];
const addVect = (vect1, vect2) => [vect1[0] + vect2[0], vect1[1] + vect2[1]];
const subVect = (vect1, vect2) => [vect2[0] - vect1[0], vect2[1] - vect1[1]];
const scaleVect = (scale, vect) => [scale * vect[0], scale * vect[1]];
const makeFrame = (origin, edgeX, edgeY) => ({
  origin,
  edgeX,
  edgeY,
});
const makeSegment = (vect1, vect2) => [vect1, vect2];
const startSegment = (origin, start) => subVect(origin, start);
const endSegment = (origin, end) => subVect(origin, end);
// 画家
const segmentsPainter = (list, origin = [0, 0]) => {
  const getX = arr => arr[0];
  const getY = arr => arr[1];

  if (list && list.length) {
    const edges = [];
    let x = 0;
    let y = 0;
    list.forEach((segment) => {
      const start = startSegment(origin, segment[0]);
      const end = endSegment(origin, segment[1]);
      x = Math.max(getX(start), getX(end), x);
      y = Math.max(getY(start), getY(end), y);
      edges.push([start, end]);
    });

    const frame = makeFrame(
      origin,
      makeVect(x, getY(origin)),
      makeVect(getX(origin), y)
    );
    return {
      edges,
      frame,
    };
  }
};
// console.log(JSON.stringify(segmentsPainter([[[1, 1], [2, 1]], [[0, 1], [1, 2]]]))); // 画十
// console.log(JSON.stringify(segmentsPainter([[[1, 1], [2, 2]], [[2, 1], [1, 2]]]))); // 画X

// 画家变换
const transformPainter = (painter, origin, corner1, corner2) => {
  const start = startSegment(origin, corner1);
  const end = endSegment(origin, corner2);
  painter.frame = makeFrame(origin, start, end);
  painter.edges = painter.edges.map((edge) => {
    let [edgeStart, edgeEnd] = edge;
    edgeStart = startSegment(origin, edgeStart);
    edgeEnd = endSegment(origin, edgeEnd);
    return [edgeStart, edgeEnd];
  });
  return painter;
};
// console.log(JSON.stringify(transformPainter(segmentsPainter([[[1, 1], [2, 1]], [[0, 1], [1, 2]]]), [0, 1], [1, 1], [0, 0])));

// 垂直反转
const flipVert = painter => transformPainter(
  painter,
  makeVect(0, 1),
  makeVect(1, 1),
  makeVect(0, 0),
);

// 右上角收缩
const shrinkToUpperRight = painter => transformPainter(
  painter,
  makeVect(0.5, 0.5),
  makeVect(1, 0.5),
  makeVect(0.5, 1),
);

// 逆时针转90°
const rotate90 = painter => transformPainter(
  painter,
  makeVect(1, 0),
  makeVect(1, 1),
  makeVect(0, 0),
);

// 图像中心收缩
const shrinkInwards = painter => transformPainter(
  painter,
  makeVect(0, 0),
  makeVect(0.65, 0.35),
  makeVect(0.35, 0.65),
);

// 判断包含
const memq = (item, list) => {
  if (list) {
    const car = listCar(list);
    if (item === car) {
      return true;
    }
    return memq(item, listCdr(list, true));
  }
  return false;
};
// console.log(memq(5, listify(1, 2, 3, 4, 5)));
// console.log(listFilter(v => v === 5, listify(1, 2, 3, 4, 5)));


const getIndexItem = (array, index = 0) => (Array.isArray(array) ? array[index] : null);
const identify = v => v;

const cad = (expression, options = {}) => {
  const {
    optSymbol,
    optSymbolRe,
    optExprRe,
  } = options;
  const symbol = optSymbol || '[\\*\\/\\+-]+';
  const symbolRe = optSymbolRe || new RegExp(symbol);
  const exprRe = optExprRe || new RegExp(`\\(?(${symbol})((?:\\s*[-\\+]?(?:\\d+|\\d*\\.\\d+)){2,})\\s*\\)?`);
  const result = exprRe.exec(expression);

  if (result) {
    const [expr, symbol, numString] = result;
    const numArray = numString.split(/\s+/g).filter(identify);
    return [expr, symbol, ...numArray];
  }

  if (!options.silence) {
    if (!symbolRe.exec(expression)) {
      return expression;
    }
    throw new Error(`the expression: ${expression} is incorrect`);
  }
  return null;
};

const getSymbolMap = symbol => (
  {
    '+': add,
    '-': minus,
    '/': divide,
    '*': multi,
    '**': expt,
  }[symbol]
);

const cadcalc = (...args) => {
  const [, symbol, ...cadNums] = cad.apply(null, args);
  const symbolFunc = getSymbolMap(symbol);
  if (symbolFunc) {
    return symbolFunc.apply(null, cadNums);
  }
  throw new Error('the ${symbol} is incorrect');
};

const cadMultiCalc = (...args) => {
  let [expression, ...opts] = args;
  let result = cad.apply(null, args);
  while (result && Array.isArray(result)) {
    const [expr] = result;
    expression = expression.replace(expr, cadcalc(expr));
    result = cad.apply(null, [expression].concat(opts));
  }
  return Number(expression);
};

const cadr = expression => Number(getIndexItem(cad(expression), 2));
const caddr = expression => Number(getIndexItem(cad(expression), 3));
const addend = expression => cadr(expression);
const augend = expression => caddr(expression);
const multiplier = expression => cadr(expression);
const multiplicand = expression => caddr(expression);
const isNumber = num => typeof num === 'number';
const makeSum = (a1, a2) => {
  a1 = isNumber(a1) ? a1 : 0;
  a2 = isNumber(a2) ? a2 : 0;
  return cadcalc(`+ ${a1} ${a2}`);
};
const makeProduct = (a1, a2) => {
  a1 = isNumber(a1) ? a1 : 0;
  a2 = isNumber(a2) ? a2 : 0;

  if (!a1 || !a2) {
    return 0;
  }
  return cadcalc(`* ${a1} ${a2}`);
};
// console.log(expect(cad('+ 5 1').toString()).to.be.equal('+ 5 1,+,5,1'));
// console.log(expect(addend('+ 5 1')).to.be.equal(5));
// console.log(expect(augend('+ 5  1')).to.be.equal(1));
// console.log(expect(multiplier('* 5 1')).to.be.equal( 5));
// console.log(expect(multiplicand('(* 5  1)')).to.be.equal(1));
// console.log(expect(makeSum(5, 2)).to.be.equal(7));
// console.log(expect(makeProduct(5, 2)).to.be.equal(10));
// console.log(expect(cadcalc('+ 5 2')).to.be.equal(7));
// console.log(expect(cadMultiCalc('*7 5')).to.be.equal(35));
// console.log(expect(cadMultiCalc('/(-(+(*7 5) 5) 5) 7')).to.be.equal(5));
// console.log(expect(cadMultiCalc('/(-(+(*7 5) 5) 5) 7)')).to.be.equal(5));
// console.log(expect(cadMultiCalc('**(/(-(+(*7 5) 5) 5) 7) 3')).to.be.equal(125));
// console.log(expect(cadMultiCalc('**(+ (- 3 -2.125) -3.125) 4')).to.be.equal(16));
// console.log(expect(cadMultiCalc('**(+ (- 3 -.125 4) -.125 4) 4')).to.be.equal(81));














// ast
const scripts = `
 const a = {
   props: {
     bindingPropLis_: {
       type: Array,
       default() {
         return [];
       },
     },
   },
   data() {
     return {
       slots: [],
     };
   },
   mounted() {
     const $slots = this.$slots;
     const slots = {};
     Object.keys($slots).forEach((key) => {
       slots[key] = $slots[key];
     });
     this.slots = slots;
     this.$on('hello', (text) => {
       console.log(text);
     });
     console.log(this);
   },
 };
`;

// console.log(JSON.stringify(esprima.parseScript(scripts), null, '  '));
// console.log(JSON.stringify(babel.transform(scripts), null, '  '));

