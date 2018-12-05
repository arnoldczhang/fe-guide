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





