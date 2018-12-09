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

// Strings Mix
function mix(s1, s2) {
  const filter = (filterFunc, list) => list.filter(filterFunc);
  const sort = (sortFunc, list) => list.sort(sortFunc || void 0);
  const forEach = (forEachFunc, list) => list.forEach(forEachFunc);
  const reduce = (reduceFunc, initial, list = []) => list.reduce(reduceFunc, initial);
  const concat = (base = [], ...args) => [].concat.call(base, ...args);
  const compose = (...funcs) => value => funcs.reduce((res, func) => func(res), value);
  
  const removeUseless = str => str.replace(/[^a-z]/g, '');
  const toLower = str => str.toLocaleLowerCase();
  const filterLetterMap = str =>
    reduce((map, val) => {
      map[val] = (map[val] | 0) + 1;
      return map;
    }, {}, str.split(''));
  const diySort = (sortMap = {}) => {
    const result = [];
    forEach(key =>
      forEach(keyInner => {
          const finalArray = sortMap[key][keyInner];
          result.push(...sort((pre, next) => pre.key > next.key, finalArray));
        },
        Object.keys(sortMap[key]),
      ),
      Object.keys(sortMap).reverse(),
    );
    return result;
  };
  const genSMap = compose(
    removeUseless,
    toLower,
    filterLetterMap,
  );
  
  const s1Map = genSMap(s1);
  const s2Map = genSMap(s2);
  
  return reduce((res, { key, max, maxVal }) => res += `/${max}:${key.repeat(maxVal)}`, '',
    diySort(reduce((res, key) => {
      const s1Val = s1Map[key] || 0;
      const s2Val = s2Map[key] || 0;
      const needRecord = s1Val > 1 || s2Val > 1;
      const [max, maxVal] = s1Val > s2Val ? [1, s1Val] : s1Val < s2Val ? [2, s2Val] : ['=', s1Val];
      if (needRecord) {
        res[maxVal] = res[maxVal] || {};
        res[maxVal][max] = res[maxVal][max] || [];
        res[maxVal][max].push({ key, max, maxVal });
      }
      return res;
    }, {}, filter(
      (val, i, list) => list.indexOf(val) === i,
      concat(Object.keys(s1Map), Object.keys(s2Map)),
      )
    ))).substring(1);
}

// Double Cola
function whoIsNext(names, r){
  let drinker;
  const queue = [...names];
  const forEachIf = (ifFunc, iterator) => {
    while(ifFunc()) {
      iterator();
    }
  };
  forEachIf(() => r-- > 0, () => {
    drinker = queue.shift();
    queue[queue.length] = drinker;
    queue[queue.length] = drinker;
  });
  return drinker;
}

// Sudoku Solution Validator
function validSolution(board){
  const filter = (filterFunc, array = []) => array.filter(filterFunc);
  const every = (everyFunc, array = []) => array.every(everyFunc);
  const map = (mapFunc, array = []) => array.map(mapFunc);
  
  const deRepeat = (array = []) => array.filter((v, i) => array.indexOf(v) === i);
  const checkSudoKu = (array = []) => every(item => item.length === deRepeat(item).length, array);
  let result = checkSudoKu(board);
  
  if (result) {
    const lArray = map((item, i) => {
      const res = [];
      let j = 0;
      while (j < board.length) {
        res.push(board[j++][i]);
      }
      return res;
    }, board);
    
    if (lArray.toString() === board.toString()) {
      result = false;
    } else {
      result = checkSudoKu(lArray);
    }
  }
  return result;
}

// Boggle Word Checker
function checkWord( board, word ) {
  debugger;
  const forEach = (forEachFunc, list) => list.forEach(forEachFunc);
  const every = (everyFunc, array = []) => array.every(everyFunc);
  const map = (mapFunc, array = []) => array.map(mapFunc);
  const reduce = (reduceFunc, initial, list = []) => list.reduce(reduceFunc, initial);
  const has = (list = [], item) => list.indexOf(item) > -1;

  const getAdjacentList = list => (xyStrList = [], result = {}, withoutList = []) => {
    const getAdj = (xyStr, exists) => {
      const [ x, y ] = map(v => +v, xyStr.split(','));
      const [ preX, preY, nextX, nextY ] = [x - 1, y - 1, x + 1, y + 1];
      const adjList = [
        `${x},${preY}`,
        `${nextX},${preY}`,
        `${nextX},${y}`,
        `${nextX},${nextY}`,
        `${x},${nextY}`,
        `${preX},${nextY}`,
        `${preX},${y}`,
        `${preX},${preY}`,
      ];

      if (Array.isArray(exists)) {
        for (let item of adjList) {
          if (has(exists, item)) {
            return item;
          }
        }
      } else {
        reduce((res, pointKey) => {
          const w = pointMap[pointKey];
          if (w) {
            res[w] = res[w] || [];
            if (!has(withoutList, pointKey) && !has(res[w], pointKey)) {
              res[w].push(pointKey);
            }
          }
          return res;
        }, result, adjList);    
      }
    };

    if (typeof xyStrList === 'string') {
      return getAdj(xyStrList, result);
    } else {
      forEach(getAdj, xyStrList);
    }
  };
  
  const getAdjacent = getAdjacentList(board);
  const genXyMap = (list = []) => {
    const wMap = {};
    const pMap = {};
    forEach((itemList, y) => {
      forEach((item, x) => {
        const point = `${x},${y}`;
        wMap[item] = wMap[item] || [];
        wMap[item].push(point);
        pMap[point] = item; 
      }, itemList);
    }, list);
    return [wMap, pMap];
  };
  
  const getLine = (input = word, length = input.length) => {
    let result = true;
    let i = 0;
    let tempMap = wordMap;
    let points = [];
    const reached = [];
    while (i < length) {
      let inp = input[i];
      const thisPoints = tempMap[inp];
      tempMap = {};
      if (thisPoints) {
        if (i === length - 1) break;
        if (thisPoints.length === 1) {
          reached[i] = thisPoints[0];
          let j = i;
          while (j >= 0 && !reached[j - 1]) {
            reached[j - 1] = getAdjacent(reached[j], points[j - 1]);
            j--;
          }
        }
        getAdjacent(thisPoints, tempMap, reached);
        i++;
        points.push(thisPoints);
        continue;
      }
      result = false;
      break;
    }
    return result;
  };
  const [ wordMap, pointMap ] = genXyMap(board);
  return getLine();
}

// The observed PIN
function getPINs(observed) {
  const reduce = (reduceFunc, initial, array = []) => array.reduce(reduceFunc, initial);
  const filter = (filterFunc, array = []) => array.filter(filterFunc);
  const forEach = (forEachFunc, array = []) => array.forEach(forEachFunc);
  const map = (mapFunc, array = []) => array.map(mapFunc);
  const concat = (base = [], ...args) => [].concat.call(base, ...args)

  const getAdjacent = (xyStr) => {
    const [ x, y ] = map(v => +v, xyStr.split(','));
    const adjArray = [
      `${x - 1},${y}`,
      `${x + 1},${y}`,
      `${x},${y - 1}`,
      `${x},${y + 1}`,
    ];
    
    return reduce((res, coord) => {
      const digit = coord2DigitMap[coord];
      if (digit !== void 0) {
        res.push(digit);
      }
      return res;
    }, [], adjArray);
  };
  
  const possibleArray = [];
  let result;
  const digit2CoordMap = {
    0: '1,3',
    1: '0,0',
    2: '1,0',
    3: '2,0',
    4: '0,1',
    5: '1,1',
    6: '2,1',
    7: '0,2',
    8: '1,2',
    9: '2,2',
  };
  const coord2DigitMap = reduce((res, [ key, val ]) => {
    res[val] = key;
    return res;
  }, {}, Object.entries(digit2CoordMap));
  
  forEach((digit) => {
    const coord = digit2CoordMap[digit];
    possibleArray.push(concat([digit], ...getAdjacent(coord)));
  }, observed.split(''));
  
  for (let possible of possibleArray) {
    if (!result) {
      result = possible;
    } else {
      result = concat(...map(item => map(res => res + item, result), possible));
    }
  }
  return result;
}

// Next smaller number with the same digits
/**
 * 正常解法
 */
function nextSmaller(n) {
  debugger;
  if (n <= 10) return -1;
  let digitArray = [...`${n}`];
  const length = digitArray.length;
  let tempArray = [digitArray[length - 1]];
  let result = n;
  
  const compose = (...funcs) => value => funcs.reduce((res, func) => func(res), value);
  const filter = (filterFunc, list) => list.filter(filterFunc);
  const concat = (base = [], ...args) => [].concat.call(base, ...args);
  const sort = (sortFunc, list = []) => list.sort(sortFunc);
  
  const getSmaller = () => {
    let i = length - 1;
    let result = false;
    while (--i >= 0) {
      let swap;
      let swapIndex;
      const digit = digitArray[i];
      const smallerArray = filter(item => item < digit, tempArray);
      if (!smallerArray.length) {
        tempArray.unshift(digit);
      } else {
        swap = String(Math.max(...smallerArray));
        swapIndex = tempArray.indexOf(swap);
        if (swapIndex > -1) {
          tempArray.splice(swapIndex, 1, digit);
          digitArray = concat(digitArray.slice(0, i), swap, ...tempArray);
          result = true;
          break;
        }
      }
    }
    return result;
  };
  
  const getBiggest = (changed) => {
    if (!changed || !+digitArray[0]) {
      return -1;
    }
    return +concat(
      digitArray.slice(0, length - tempArray.length),
      sort((pre, next) => pre < next, tempArray)
    ).join('');
  };
  
  return compose(
    getSmaller,
    getBiggest,
  )();
}

/**
 * 算法解法
 */
const nextSmaller2 = n => {
  let min = minify(n);
  while (--n >= min) if (minify(n) === min) return n;
  return -1;
};

const minify = n => [...`${n}`].sort().join``.replace(/^(0+)([1-9])/, '$2$1');

// Rail Fence Cipher: Encoding and Decoding
/**
 * 正常解法
 */
function encodeRailFenceCipher (string, numberRails) {
  const cipherArray = getCipherArray(string, numberRails);
  return arrayJoin(cipherArray);
}

function decodeRailFenceCipher(string, numberRails) {
  const cipherArray = getCipherArray(string, numberRails);
  let i = 0;
  let cipherIndex = 0;
  const result = [];
  const length = string.length;
  const strArray = [...string];
  
  const forEach = (forEachFunc, array = []) => array.forEach(forEachFunc);
  const getCipherIndex = getCipherListIndex(cipherArray);
  
  forEach((item, index) => {
    forEach((it, idx) => {
      cipherArray[index][idx] = strArray.shift();
    }, item);
  }, cipherArray);
  
  while (i < length) {
    result.push(cipherArray[cipherIndex][i]);
    cipherIndex = getCipherIndex(cipherIndex);
    i++;
  }
  
  return result.join('');
}

function arrayJoin(array) {
  const map = (mapFunc, arr = []) => arr.map(mapFunc);
  return map(item => item.join(''), array).join('');
};

function getCipherListIndex(array = []) {
  let next = true;
  const max = array.length - 1;
  return (index) => {
    if (next) {
      if (index < max) {
        index++;
      } else {
        next = false;
        index--;
      }
    } else {
      if (index > 0) {
        index--;
      } else {
        next = true;
        index++;
      }
    }
    return index;
  };
};

function getCipherArray(string, numberRails) {
  let cipherIndex = 0;
  const cipherArray = Array.from({ length: numberRails || 1 }).fill(1);
  const strArray = [...string];
  
  const forEach = (forEachFunc, array = []) => array.forEach(forEachFunc);
  const getCipherIndex = getCipherListIndex(cipherArray);
  
  forEach((item, index) => cipherArray[index] = [], cipherArray);
  for(let [ index, letter ] of strArray.entries()) {
    cipherArray[cipherIndex][index] = letter;
    cipherIndex = getCipherIndex(cipherIndex);
  }
  return cipherArray;
}

function* rails(rn, ln) {
    for (var rc = 0; rc < rn; ++rc) {
        var rv = rc, rd = rc;
        while (rv < ln) {
            yield rv;
            rv += 2 * (rn - 1 - (rn == rd + 1 ? 0 : rd));
            rd = rn - 1 - rd;
        }
    }
}

/**
 * 算法解法
 */
function encodeRailFenceCipher2(s, numberRails) {
    return Array.from(rails(numberRails, s.length)).map(function(i) {
        return s[i];
    }).join("");
}

function decodeRailFenceCipher2(s, numberRails) {
    var r = [];
    for (var [i, k] of Array.from(rails(numberRails, s.length)).entries()) {
        r[k] = s[i];
    }
    return r.join("");
}

Array.prototype.sameStructureAs = function (other) {
    if (this.length !== other.length) {
      return false;
    }
};

// Nesting Structure Comparison
/**
 * 正常解法
 */
Array.prototype.sameStructureAs = function (other) {
  if (this.length !== other.length) {
    return false;
  }
  
  for (let [ index, item ] of this.entries()) {
    const isThisArray = Array.isArray(item);
    const otherItem = other[index];
    const isOtherArray = Array.isArray(otherItem);
    
    if (isThisArray && isOtherArray) {
      return item.sameStructureAs(otherItem);
    } else if (isThisArray | isOtherArray === 1){
      return false;
    }
  }
  return true;
};

/**
 * 算法解法
 */
 Array.prototype.sameStructureAs = function (other) {
    return (this.length === other.length) ? this.every(function(el, i){
      return Array.isArray(el) ? el.sameStructureAs(other[i]) : true;
    }) : false;
};

// Centre of attention
function central_pixels(image, color) {
  const {
    pixels: points,
    width: offset,
    height,
  } = image;
  const length = points.length;
  const maxIndex = length - 1;
  const DEP = Math.min(offset, height) / 2;
  const maxDepMap = {};
  let maxDepth;
  let maxDepList = [];
  
  const forEach = (forEachFunc, array = []) => array.forEach(forEachFunc);
  const every = (everyFunc, array = []) => array.every(everyFunc);
  const map = (mapFunc, list = []) => list.map(mapFunc);
  
  const getAdjacentIndex = (index, rect = 1) => {
    return [index - offset, index + 1, index + offset, index - 1];
  };
  const notHorizonBorder = index => index > offset && index < maxIndex - offset;
  const notVerticalBorder = index => index % offset !== 0 && (index + 1) % offset !== 0;
  
  const getDepth = (cr, index, depth = 0) => {
    if (depth >= DEP) {
      return depth;
    }
    
    const adjIndex = getAdjacentIndex(index);
    const withinArea = every(
      idx => idx >= 0 && idx <= maxIndex,
      adjIndex,
    );
    if (withinArea) {
      const withinBorder = every(
        idx => notHorizonBorder(idx) && notVerticalBorder(idx),
        adjIndex,
      );
      const isTheSameColor = every(idx => points[idx] === cr, adjIndex);
      if (withinBorder && isTheSameColor) {
        depth = Math.min(...map(val => maxDepList.indexOf(val) > -1 ? (maxDepMap[val] + 1) : getDepth(cr, val, depth + 1), adjIndex));
      } else if (isTheSameColor) {
        depth += 1;
      }
    }
    return depth;
  };
  
  forEach((point, index) => {
    if (point === color) {
      const depth = getDepth(point, index, 0);
      if (!maxDepList.length || maxDepth === depth) {
        maxDepMap[index] = maxDepth = depth;
        maxDepList[maxDepList.length] = index;
      } else if (depth > maxDepth) {
        maxDepMap[index] = maxDepth = depth;
        maxDepList = [index];
      }
    }
  }, points);
  return maxDepList;
}