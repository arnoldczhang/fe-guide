// multiples of 3 or 5
function solution1(number){
  let numArray = [];
  let tempNum = number - 1;
  const three = 3;
  const five = 5;
  
  const isAboveMin = min => val => val >= min;
  const isMultiples = divisor => val => !(val % divisor);
  const some = (...funcs) => val => funcs.some(func => func(val));
  const reduce = (reduceFunc, initial, list = []) => list.reduce(reduceFunc, initial);
  const filter = (predicateFunc, arr) => {
    const newList = [];
    for (let [idx, v] of arr.entries()) {
      if (predicateFunc(v, idx, arr)) {
        newList.push(v);
      }
    }
    return newList;
  };
  
  const isAboveThree = isAboveMin(three);
  
  while (isAboveThree(tempNum)) {
    numArray.push(tempNum--);
  }
  
  numArray = filter(
    some(
      isMultiples(three),
      isMultiples(five),
    ),
    numArray,
  );
  
  console.log(numArray);
  return reduce((res, val) => res + val, 0, numArray);
}

// build tower
function towerBuilder(nFloors) {
  const maxStarNum = nFloors * 2 - 1;
  const result = new Array(nFloors);
  let tempNum = nFloors;
  let starNum = maxStarNum;
  
  const add = (...args) => args.reduce((a, b) => a + b);
  const forEachIf = (predicateFunc, forEachFunc) => {
    let stacks = 1000;
    while (stacks-- > 0 && predicateFunc()) {
      forEachFunc();
    }
  };
  
  forEachIf(() => --tempNum >= 0, () => {
    const spaceSize = (maxStarNum - starNum) / 2;
    result[tempNum] = add(
      ' '.repeat(spaceSize),
      '*'.repeat(starNum),
      ' '.repeat(spaceSize),
    );
    starNum -= 2;
  });
  return result;
}


// counting duplicates
function duplicateCount(text){
  const tArray = text.toLowerCase().split('');
  const map = {};
  let result = 0;
  const forEach = (forEachFunc, list = []) => list.forEach(forEachFunc);
  forEach((item) => {
    map[item] = map[item] || 0;
    map[item] += 1;
    result += map[item] === 2 ? 1 : 0;
  }, tArray);
  return result;
}

// The Supermarket Queue
function queueTime(customers, n) {
  const tillArray = new Array(n).fill(0);
  const tillLength = tillArray.length;
  
  const forEach = (forEachFunc, list = []) => list.forEach(forEachFunc);
  const map = (mapFunc, list = []) => list.map(mapFunc);
  const add = (...args) => args.length ? args.reduce((a, b) => a + b) : 0;
  const indexOf = list => val => list.indexOf(val);
  
  const indexOfTill = indexOf(tillArray);
  
  forEach((customer, index) => {
    const min = Math.min(...tillArray);
    tillArray[indexOfTill(min)] += customer;
  }, customers);
  
  console.log(tillArray);

  return Math.max(...tillArray);
}

// weight for weight
function orderWeight(strng) {
  const weightMap = {};
  const weightArray = strng.split(' ');
  const sort = (sortFunc, list = []) => list.sort(sortFunc);
  const toDigit = val => Number(val);
  const reduce = (reduceFunc, initial, list = []) => list.reduce(reduceFunc, initial);
  const concat = (base = [], ...args) => [].concat.call(base, ...args);
  const forEach = (forEachFunc, list = []) => list.forEach(forEachFunc);
  const map = (mapFunc, list = []) => list.map(mapFunc);
  const add = (...args) => args.length ? reduce((a, b) => a + b, 0, args) : 0;
  const getDigitSum = val => add(...map(toDigit, String(val).split('')));
  
  forEach((weight) => {
    weightSum = getDigitSum(weight);
    weightMap[weightSum] = weightMap[weightSum] || [];
    weightMap[weightSum].push(weight);
  }, weightArray);
  
  return concat(
    ...map(
      key => sort((pre, next) => pre > next, weightMap[key]),
      Object.keys(weightMap),
    ),
  ).join(' ');
}

// Which are in
function inArray(array1,array2){
  const result = [];
  const str = array2.join(' ');
  const forEach = (forEachFunc, list = []) => list.forEach(forEachFunc);
  forEach((val) => {
    if (str.indexOf(val) > -1) {
      result.push(val);
    }
  }, array1);
  return result.sort();
}

// Who likes it
function likes(names) {
  let result;
  const [first, second, third, ...others] = names;
  switch(names.length) {
    case 0:
      result = 'no one likes this';
      break;
    case 1:
      result = `${first} likes this`;
      break;
    case 2:
      result = `${first} and ${second} like this`;
      break;
    case 3:
      result = `${first}, ${second} and ${third} like this`;
      break;
    default:
      result = `${first}, ${second} and ${others.length + 1} others like this`;
      break;
  }
  return result;
}

// Human readable duration format
function formatDuration (seconds) {
  let tempSec = seconds;
  const PER_HOUR = 60;
  const PER_DAY = 24;
  const PER_YEAR = 365;
  const SECOND = 1;
  const MINUTE = 60;
  const HOUR = PER_HOUR * MINUTE;
  const DAY = PER_DAY * HOUR;
  const YEAR = PER_YEAR * DAY;
  const timeArray = [[YEAR, 'year'], [DAY, 'day'], [HOUR, 'hour'], [MINUTE, 'minute'], [SECOND, 'second']];
  const result = [];
  
  const forEachIf = (ifFunc, iterator, list = []) => {
    for (let [index, item] of list.entries()) {
      if (!ifFunc()) {
        return;
      }
      iterator(item, index, list);
    }
  };
  
  forEachIf(() => tempSec > 0, ([time, word]) => {
    const count = tempSec / time | 0;
    if (count) {
      result.push(`${count} ${word}${count > 1 ? 's' : ''}`);
      tempSec -= count * time;
    }
  }, timeArray);
  return seconds ? result.join(', ').replace(/(, )([^,]+)$/, ' and $2') : 'now';
}

// Sum Strings as Numbers
function sumStrings(a,b) {
  let result = '';
  let carry = 0;
  const ten = 10;
  const getNumArray = str => str.replace(/^0+/, '').split('').reverse();
  const aArray = getNumArray(a);
  const bArray = getNumArray(b);
  
  const reduce = (reduceFunc, initial, list = []) => list.reduce(reduceFunc, initial);
  const add = (...args) => args.length ? reduce((a, b) => a + b, 0, args) : 0;
  
  for (let i = 0; i < Math.max(aArray.length, bArray.length); i += 1) {
    const numA = +aArray[i] || 0;
    const numB = +bArray[i] || 0;
    const sum = add(numA, numB, carry);
    const digit = sum % ten;
    result = digit + result;
    carry = sum >= ten ? 1 : 0;
  }
  return carry ? `${carry}${result}` : result;
}




