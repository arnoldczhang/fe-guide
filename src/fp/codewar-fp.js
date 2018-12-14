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

/**
 * 正常解法
 */
function whoIsNext(names, r){
  const queue = [...names];
  const len = queue.length;
  let isEnd = false;
  
  const reduce = (reduceFunc, initial, list = []) => list.reduce(reduceFunc, initial);
  const iterator = (val, step = len, res = 1, n = 0) => {
    if (res >= val) {
      return res - val;
    } 
    return iterator(val, step, res + step * Math.pow(2, n), n + 1);
  };
  
  const [ minCount, lastIndex ] = reduce((res, val, i) => {
    if (isEnd) return res;
    let [ min, idx ] = res;
    const count = iterator(r, i + len, i + 1);
    isEnd = count === 0;
    if (count <= min) {
      min = count;
      idx = i;
    }
    return [ min, idx ];
  }, [Infinity, 0], queue);
  return queue[minCount === 0 ? lastIndex : lastIndex > 0 ? lastIndex - 1 : len - 1 + lastIndex ];
}

/**
 * 算法解法
 */
function whoIsNext(names, r) {
  var l = names.length;
  while (r >= l) { r -= l; l *= 2; }
  return names[Math.ceil(names.length * r / l)-1];
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
// https://www.codewars.com/kata/centre-of-attention/javascript
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

// Password System
/**
 * 正常解法
 */
function helpZoom(key){
  const len = key.length;
  let result = 'No';
  const halfLen = len / 2;
  const [ pre, next ] = [key.slice(0, halfLen), key.slice(Math.ceil(halfLen))];
  if (pre.join() === next.reverse().join()) {
    result = 'Yes';
  }
  return result;
}

/**
 * 算法解法
 */
 function helpZoom2(key){
  return key.join('') == key.reverse().join('') ? 'Yes' : 'No';
}

// Line Safari - Is that a line?
function line(grid) {
  debugger;
  const DIR = {
    UP: '-1,0',
    DOWN: '1,0',
    LEFT: '0,-1',
    RIGHT: '0,1',
  };
  const POINT = {
    END: 'X',
    HOR: '-',
    VER: '|',
    CORN: '+',
  };
  const {
    END,
    HOR,
    VER,
    CORN,
  }= POINT;
  const {
    UP,
    DOWN,
    LEFT,
    RIGHT,
  } = DIR;
  const PDMAP = {
    [UP]: [ CORN, VER, END ],
    [DOWN]: [ CORN, VER, END ],
    [LEFT]: [ CORN, HOR, END ],
    [RIGHT]: [ CORN, HOR, END ],
  };
  const PMAP = {
    [END]: [ CORN, HOR, VER, END ],
    [HOR]: [ CORN, HOR, END ],
    [CORN]: [ CORN, HOR, VER, END ],
    [VER]: [ CORN, VER, END ],
  };
  let isLine = false;
  let isEnd = false;
  let points;
  let tempPoints;
  const pointReached = [];

  const filter = (filterFunc, array = []) => array.filter(filterFunc);
  const compose = (...funcs) => value => funcs.reduce((res, func) => func(res), value);
  const forEach = (forEachFunc, array = []) => array.forEach(forEachFunc);
  const map = (mapFunc, array = []) => array.map(mapFunc);
  const reduce = (reduceFunc, initial, list = []) => list.reduce(reduceFunc, initial);
  const indexOf = (array = [], el) => array.indexOf(el);
  const within = (...args) => indexOf(...args) > -1;
  const every = (everyFunc, array = []) => array.every(everyFunc);
  const concat = (base = [], ...args) => [].concat.call(base, ...args);

  const findStartX = (grid) => {
    for (let i = 0; i < grid.length; i += 1) {
      const thisLine = grid[i];
      const subI = indexOf(thisLine, END);
      if (subI > -1) {
        return [ i, subI, END ];
      }
    }
    return [];
  };
  
  const getPoint = pos => pos.join();
  const getPos = point => point.split(',');
  const add2Reached = (...pos) => pointReached.push(...pos);
  const getImgPoint = ([ i, subI ]) => grid[i] && grid[i][subI];
  
  const getStartIndex = compose(
    findStartX,
    getPoint,
  );
  
  const getAdjPoints = (points) => map(
    (point) => {
      const [ index, subIndex ] = getPos(point);
      const adjacent = [
        [ +index, +subIndex - 1 ],
        [ +index, +subIndex + 1 ],
        [ +index - 1, +subIndex ],
        [ +index + 1, +subIndex ],
      ];
      return reduce((res, adj) => {
        const img = getImgPoint(adj);
        if (img && img !== ' ') {
          adj = getPoint([ ...adj, img ]);
          if (!within(pointReached, adj)) {
            add2Reached(adj);
          } else {
            adj = true;
          }
          res.push(adj);
        }
        return res;
      }, [], adjacent);
    },
    points,
  );
  
  const isMatched = (prePoints, adjPoints) => {
    let result = true;
    for (let i = 0; i < prePoints.length; i += 1) {
      const [ preI, preSubI, preImg ] = getPos(prePoints[i]);
      const adjPoint = adjPoints[i];
      const preRes = every((info) => {
        if (typeof info === 'boolean' && info) {
          return true;
        }
        const [ i, subI, adjImg ] = getPos(info);
        const key = `${i - preI},${subI - preSubI}`;
        return within(PDMAP[key], adjImg) && within(PMAP[preImg], adjImg);
      }, adjPoint);
      
      if (!preRes) {
        result = false;
        break;
      }
    }
    return result;
  };
  
  const isEndPoint = (points) => {
    return points.length === 1 && getPos(points[0])[2] === END;
  };
  
  grid = map(gr => gr.join(''), grid);
  points = [getStartIndex(grid)];
  add2Reached(...points);

  if (points && points.length) {
    while (!isEnd) {
      tempPoints = getAdjPoints(points);
      if (isMatched(points, tempPoints)) {
        points = filter(point => typeof point !== 'boolean', concat(...tempPoints));
        if (isEndPoint(points)) {
          isEnd = true;
          isLine = true;
          break;
        }
      } else {
        isLine = false;
        isEnd = true;
        break;
      }
    }
  }
  return isLine;
}

// Snail
/**
 * 正常解法
 */
const snail = function(array) {
  const result = [];
  const roadMap = {};
  const [ UP, DOWN, LEFT, RIGHT ] = [ 0, 1, 2, 3 ];
  const [ height, width ] = [ array.length, array[0].length ];

  let point = [ 0, 0 ];
  let isEnd = false;
  let dir = RIGHT;
  
  if (!width) return [];
  
  const walk = (p = point) => roadMap[`${p[0]},${p[1]}`] = 1;
  const inMap = ([ x, y ]) => !!roadMap[`${x},${y}`];
  const isBeyond = ([ x, y ]) => x < 0 || y < 0 || x >= height || y >= width;
  const isExcept = (p = point) => inMap(p) || isBeyond(p);
  const getVal = (p = point) => {
    const [ x, y ] = p;
    result.push(array[x][y]);
  };
  
  const updateDir = (p = point) => {
    const nextPoint = goNext();
    if (isExcept(nextPoint)) {
      dir = [ RIGHT, LEFT, UP, DOWN ][dir];
    }
  };
  
  const goNext = (p = point, d = dir) => {
    const [ x, y ] = p;
    switch(d) {
      case UP:
        return [x - 1, y];
      case DOWN:
        return [x + 1, y];
      case LEFT:
        return [x, y - 1];
      case RIGHT:
        return [x, y + 1];
    };
  };

  const forEach = (forEachFunc, array = []) => array.forEach(forEachFunc);
  const comb = (...funcs) => (val) => {
    forEach(func => func(val), funcs);
  };

  const dealPoint = comb(
    walk,
    getVal,
    updateDir,
  );
  
  while (!isEnd) {
    dealPoint(point);
    point = goNext();
    if (isExcept(point)) {
      isEnd = true;
    }
  }
  return result;
}

/**
 * 算法解法
 */
const snail2 = function(array) {
  var result;
  while (array.length) {
    // Steal the first row.
    result = (result ? result.concat(array.shift()) : array.shift());
    // Steal the right items.
    for (var i = 0; i < array.length; i++)
      result.push(array[i].pop());
    // Steal the bottom row.
    result = result.concat((array.pop() || []).reverse());
    // Steal the left items.
    for (var i = array.length - 1; i >= 0; i--)
      result.push(array[i].shift());
  }
  return result;
}

// ConnectFour
/**
 * 正常解法
 */
function whoIsWinner(piecesPositionList){
  const DRAW = 'Draw';
  const colMap = {};
  const players = {
    Red: [],
    Yellow: [],
  };
  const cols = 'ABCDEFG';
  const input = [...piecesPositionList];
  let result = 'Draw';
  let hand = 0;

  const forEach = (forEachFunc, array = []) => array.forEach(forEachFunc);
  const some = (someFunc, array = []) => array.some(someFunc);
  const map = (mapFunc, array = []) => array.map(mapFunc);
  const sort = (sortFunc, array = []) => Array.isArray(sortFunc) ? sortFunc.sort() : array.sort(sortFunc);
  const hasFound = () => result !== DRAW;
  const oneReMatch = res => str => some(re => re.test(str), res);

  const getPlayStr = (key, func) => {
    if (typeof func === 'function') {
      return func(players[key]);
    }
    return sort(players[key]).join('');
  };
  
  const getlineRE = (str) => {
    const [ a, b, c, d ] = str.split('');
    return new RegExp(`${a}(\\d).*${b}\\1.*${c}\\1.*${d}\\1`);
  };
  
  const getColRE = (str) => {
    const [ i, j, k, l ] = str.split('');
    return new RegExp(`([ABCDEFG])[${i}].*\\1[${j}].*\\1[${k}].*\\1[${l}]`);
  };
  
  const getLRDiagoRE = (str, reverse = false) => {
    let [ a, b, c, d ] = str.split('');
    if (reverse) {
      return [
        new RegExp(`${a}6.*${b}5.*${c}4.*${d}3`),
        new RegExp(`${a}5.*${b}4.*${c}3.*${d}2`),
        new RegExp(`${a}4.*${b}3.*${c}2.*${d}1`),
        new RegExp(`${a}3.*${b}4.*${c}5.*${d}6`),
        new RegExp(`${a}2.*${b}3.*${c}4.*${d}5`),
        new RegExp(`${a}1.*${b}2.*${c}3.*${d}4`),
      ];
    }
    return [
      new RegExp(`${a}1.*${b}2.*${c}3.*${d}4`),
      new RegExp(`${a}2.*${b}3.*${c}4.*${d}5`),
      new RegExp(`${a}3.*${b}4.*${c}5.*${d}6`),
      new RegExp(`${a}4.*${b}3.*${c}2.*${d}1`),
      new RegExp(`${a}5.*${b}4.*${c}3.*${d}2`),
      new RegExp(`${a}6.*${b}5.*${c}4.*${d}3`),
    ];
  };
  
  const getRLDiagoRE = str => getLRDiagoRE(str, true);
  
  const getDiagonRE = (str) => {
    return [].concat(...map((col) => {
      switch(col) {
        case 'A':
          return getLRDiagoRE('ABCD');
        case 'B':
          return getLRDiagoRE('BCDE');
        case 'C':
          return getLRDiagoRE('CDEF');
        case 'D':
          return [...getLRDiagoRE('DEFG'), ...getRLDiagoRE('DEFG')];
        case 'E':
          return getRLDiagoRE('BCDE');
        case 'F':
          return getRLDiagoRE('CDEF');
        case 'G':
          return getRLDiagoRE('DEFG');
      }
    }, [...str]));
  };
  
  const isLineWin = oneReMatch([
    getlineRE('ABCD'),
    getlineRE('BCDE'),
    getlineRE('CDEF'),
    getlineRE('DEFG'),
  ]);
  
  const isColWin = oneReMatch([
    getColRE('1234'),
    getColRE('2345'),
    getColRE('3456'),
  ]);
  
  const isDiagonWin = oneReMatch([
    ...getDiagonRE(cols),
  ]);

  const findTheWinner = () => {
    forEach((key) => {
      playerStr = getPlayStr(key);
      if (isLineWin(playerStr) || isColWin(playerStr) || isDiagonWin(playerStr)) {
        result = key;
      }
    }, Object.keys(players));
  };
  
  for (let col of [...cols]) {
    colMap[col] = 0;
  }
  
  while(input.length) {
    const thisHand = input.shift();
    const [ col, color ] = thisHand.split('_');
    colMap[col] += 1;
    players[color].push(`${col}${colMap[col]}`);
    if (++hand >= 8) {
      findTheWinner();
      if (hasFound()) break;
    }
  }
  return result;
}

/**
 * 算法解法
 */
function whoIsWinner2(piecesPositionList){
 dict = {A: 35, B: 36, C: 37, D: 38, E: 39, F: 40, G:41};
  res = new Array(42).fill("-");
  for(s of piecesPositionList){
    res[dict[s[0]]] = s[2];
    dict[s[0]] -= 7;
    if(/((R.{6}){3}R)|(^((.{0,3}|.{7,10}|.{14,17}|.{21,24}|.{28,31}|.{35,38})R{4}))|(^((.{3,6}|.{10,13}|.{17,20})(R.{5}){3}R))|(^(.{0,3}|.{7,10}|.{14,17})(R.{7}){3}R)/.test(res.join(""))) return "Red";
    if(/((Y.{6}){3}Y)|(^((.{0,3}|.{7,10}|.{14,17}|.{21,24}|.{28,31}|.{35,38})Y{4}))|(^((.{3,6}|.{10,13}|.{17,20})(Y.{5}){3}Y))|(^(.{0,3}|.{7,10}|.{14,17})(Y.{7}){3}Y)/.test(res.join(""))) return "Yellow";
  }
  return "Draw";
}

// Directions Reduction
function dirReduc(arr){
  const dirMap = {
    NORTH: 'SOUTH',
    SOUTH: 'NORTH',
    EAST: 'WEST',
    WEST: 'EAST',
  };
  
  const reduce = (reduceFunc, initial, list = []) => list.reduce(reduceFunc, initial);
  
  return reduce((res, dir) => {
    if(res.length) {
      const preDir = res.pop();
      if (preDir !== dirMap[dir]) {
        res.push(preDir, dir);
      }
    } else {
      res.push(dir);
    }
    return res;
  }, [], arr);
}

// Sum of Pairs
/**
 * 正常解法
 */
var sum_pairs = function(ints, s){
  const intMap = {};
  const intsClone = ints.filter((intN, idx) => {
    intMap[intN] = intMap[intN] || 0;
    if (intMap[intN] === 2) {
      return false;
    } else {
      intMap[intN] += 1;
    }
    return true;
  });
  const length = intsClone.length;
  const match = new Array(length);
  let maxIndex = length;
  let min;
  let i = 0;
  let j;
  
  while (i < maxIndex){
    const intNum = intsClone[i];
    j = i + 1;
    while (j < maxIndex) {
      const nextNum = intsClone[j];
      if (intNum + nextNum === s) {
        match[i] = j;
        min = maxIndex = j;
        break;
      }
      j++;
    }
    i++;
  }
  
  if (min === undefined) {
    return min;
  }
  
  min = Math.min(...match.filter(v => v));
  return [intsClone[match.indexOf(min)], intsClone[min]];
}

/**
 * 算法解法
 */
var sum_pairs2 = function(ints, s){
  var seen = {}
  for (var i = 0; i < ints.length; ++i) {
    if (seen[s - ints[i]]) return [s - ints[i], ints[i]];
    seen[ints[i]] = true
  }
}

// Valid Parentheses
/**
 * 正常解法
 */
function validParentheses(parens){
  if (parens[parens.length - 1] === '(') {
    return false;
  }
  const temp = [];
  const paranMap = {
    '(': ')',
    ')': '(',
  };
  parans = [...parens];
  while (parans.length) {
    const paran = parans.shift();
    if (temp[temp.length - 1] === paranMap[paran]) {
      temp.pop();
    } else {
      temp.push(paran);
    }
  }
  return !temp.length;
}

/**
 * 算法解法
 */
function validParentheses(string){
   var tokenizer = /[()]/g, // ignores characters in between; parentheses are
       count = 0,           // pretty useless if they're not grouping *something*
       token;
   while(token = tokenizer.exec(string), token !== null){
      if(token == "(") {
         count++;
      } else if(token == ")") {
         count--;
         if(count < 0) {
            return false;
         }
      }
   }
   return count == 0;
}

// Simple Pig Latin
/**
 * 正常解法
 */
function pigIt(str){
  return str.split(' ').map(item => /\w/.test(item) ? `${item.substr(1)}${item[0]}ay` : item).join(' ')
}

/**
 * 算法解法
 */
function pigIt(str){
  return str.replace(/(\w)(\w*)(\s|$)/g, "\$2\$1ay\$3")
}

// A Chain adding function
function add(n, o = 0){
  const result = add.bind(null, n += o);
  result.valueOf = () => n;
  return result;
}

// Maximum subarray sum
/**
 * 正常解法
 */
var maxSequence = function(arr){
  if (!arr.length) {
    return 0;
  }
  const every = (everyFunc, array = []) => array.every(everyFunc);
  const reduce = (reduceFunc, initial, list = []) => list.reduce(reduceFunc, initial);

  const isNegative = val => val < 0;
  const isPositive = val => val >= 0;

  const len = arr.length;
  const sum = reduce((res, val) => res += val, 0, arr);
  let max = sum;
  let result;
  
  if (every(isPositive, arr)) {
    return sum;
  }
  
  if (every(isNegative, arr)) {
    return 0;
  }
  
  for (let i = 0; i < len; i += 1) {
    if (arr[i] > 0) {
      const tempCountArr = reduce((res, val) => {
        res[res.length] = res[res.length - 1] + val;
        return res;
      }, [arr[i]], arr.slice(i + 1));
      const tempMax = Math.max(...tempCountArr);
      
      if (tempMax > max) {
        max = tempMax;
        result = arr.slice(i, tempCountArr.indexOf(tempMax));
      }
    }
  }
  return max;
}

/**
 * 算法解法
 */
var maxSequence = function(arr){
  var min = 0, ans = 0, i, sum = 0;
  for (i = 0; i < arr.length; ++i) {
    sum += arr[i];
    min = Math.min(sum, min);
    ans = Math.max(ans, sum - min);
  }
  return ans;
}

// Scramblies
function scramble(str1, str2) {
  const str1L = str1.length;
  const str2L = str2.length;
  const indexMap = {};
  let result = true;
  let i = 0;
  if (str1L < str2L) return false;
  while (i < str2L) {
    const word = str2[i];
    const matchIndex = str1.indexOf(word, indexMap[word] ? (indexMap[word] + 1) : 0);
    if (matchIndex === -1) {
      result = false;
      break;
    }
    indexMap[word] = matchIndex;
    i += 1;
  }
  return result;
}

// Molecule to atoms
/**
 * 正常解法
 */
function parseMolecule(formula) {
  const hasParanthese = input => /[\{\(\[]/.test(input);
  const ParentheseRE = /([\{\(\[])([A-Za-z\d]+)([\}\)\]])([1-9]*)/g;
  const elementRE = /([A-Z][a-z]?)(\d*)/g;
  const result = {};
  let elementExecRes;

  while(hasParanthese(formula)) {
    formula = formula.replace(ParentheseRE, (...args) => {
      const [ , leftBracket, word, rightBracket, times ] = args;
      let output = '';
      if (leftBracket && rightBracket) {
        let re = /([A-Z][a-z]*)(\d*)/g;
        let res;
        if (times) {
          while (res = re.exec(word)) {
            const [ , w, i = 1 ] = res;
            output += `${w}${(+i || 1) * (+times || 1)}`;
          }
          return output;
        }
      }
      return word;
    });
  }
  
  while(elementExecRes = elementRE.exec(formula)) {
    const [ , key, value ] = elementExecRes;
    result[key] = result[key] || 0;
    result[key] += +value || 1;
  }
  return result;
}

/**
 * 算法解法
 */
function parseMolecule2(s) {
  var o = {}
  while (s != (s = s.replace(/[\[\(\{]([a-z0-9]+)[\]\)\}]([0-9]+)/gi, (f,e,n) => repeat(e,n))));
  s.replace(/([A-Z][a-z]?)([0-9]+)?/g, (f,e,n) => (o[e] = (o[e] || 0) + +(n || 1)));
  return o;
}

function repeat(s, n) {
  for (var r = ""; n--; r += s);
  return r;
}

// Human Readable Time
/**
 * 正常解法
 */
function humanReadable(seconds) {
  const reduce = (reduceFunc, initial, list = []) => list.reduce(reduceFunc, initial);
  const format = val => String(val).length === 1 ? `0${val}` : val;

  return reduce((res,unit) => {
    const count = Math.floor(seconds / unit);
    seconds -= count * unit;
    res += ':' + format(count);
    return res;
  }, '', [60 * 60, 60, 1]).substr(1);
}

/**
 * 算法解法
 */
function humanReadable2(seconds) {
  var pad = function(x) { return (x < 10) ? "0"+x : x; }
  return pad(parseInt(seconds / (60*60))) + ":" +
         pad(parseInt(seconds / 60 % 60)) + ":" +
         pad(seconds % 60)
}

// Moving Zeros To The End
/**
 * 正常解法
 */
var moveZeros = function (arr) {
  let zeroCount = 0;
  const filter = (filterFunc, array = []) => array.filter(filterFunc);
  arr = filter((item) => {
    const isZero = item === 0;
    if (isZero) zeroCount++;
    return !isZero;
  }, arr);
  arr.push(...new Array(zeroCount).fill(0));
  return arr;
}

/**
 * 算法解法
 */
var moveZeros2 = function (arr) {
  return arr.filter(function(x) {return x !== 0}).concat(arr.filter(function(x) {return x === 0;}));
}

// Integers: Recreation One
/**
 * 正常解法
 */
function listSquared(m, n) {
  let index = m;
  const result = [];
  
  const getSumSquare = (target) => {
    const max = Math.floor(index / 2);
    let idx = 1;
    let res = 0;
    while(idx <= max) {
      if (target % idx === 0) {
        res += Math.pow(idx, 2);
      }
      idx++;
    }
    return res + Math.pow(target, 2);
  };
  
  while(index <= n) {
    let sum = getSumSquare(index);
    let sqrtSum = Math.sqrt(sum);
    if (sqrtSum === sqrtSum >>> 0) {
      result.push([index, sum]);
    }
    index++;
  }
  return result;
}

/**
 * 算法解法
 */
 function listSquared2(m, n) {
  var arr = [];
  for (var i = m; i <= n; i++){
    var temp = 0;
    for (var j = 1; j <= i; j++) {
      if ( i % j == 0) temp += j*j;  
    };
    if ( Math.sqrt(temp) % 1 == 0) arr.push([i, temp]);
  };
  return arr;
}


