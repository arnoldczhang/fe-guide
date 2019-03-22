/**
 * x皇后
 *
 * 坐标判断标准：
 * - 横坐标（数组index）不等
 * - 纵坐标（数组index的对应值）不等
 * - 斜边（纵横坐标差的绝对值）不等
 * 
 */

const FALSE = -1;

const isEq = (x, y) => x === y;
const absMinus = (coordX, coordY) => Math.abs(coordX - coordY);
const getDiagonal = (coordX, coordY) => [coordX, coordY];
const has = (list = [], item) => {
  list = list && list.length ? list : [];
  return list.indexOf(item) !== FALSE;
};
const hasCoordXYEq = (list = [], coord = []) => {
  let hasEq = false;
  for (let cach of list) {
    if (isEq(
      absMinus(cach[0], coord[0]),
      absMinus(cach[1], coord[1])
    )) {
      hasEq = true;
      break;
    }
  }
  return hasEq;
};
const resetList = (length = 8, value = FALSE) => Array.from({ length }, () => value);
const push = (list = [], value) => {
  list = Array.isArray(list) ? list : [];
  list.push(value);
  return list;
};

function findQueue(length = 8) {
  let coords = resetList();
  let solutionCount = 0;
  const solution = [];
  const diagonalList = [];
  const triedList = resetList(length, 0);

  let diagonal;
  let nowRow = 0;
  let nowCol = 0;

  const updateNowCol = () => {
    nowCol = nowCol < length - 1 ? nowCol + 1 : 0;
    while (has(coords, nowCol)) {
      if (nowCol >= length - 1) {
        nowCol = 0;
      } else {
        nowCol += 1;
      }
    }
  };

  const updateDiagonal = () => {
    diagonal = getDiagonal(nowRow, nowCol);
    const temp = [];
    while (hasCoordXYEq(diagonalList, diagonal)) {
      updateNowCol();
      if (has(temp, diagonal.toString())) {
        return false;
      }
      push(temp, diagonal.toString());
      diagonal = getDiagonal(nowRow, nowCol);
    }
    return true;
  };

  debugger;
  while (nowRow < length) {
    if (updateDiagonal() && !has(triedList[nowRow], nowCol)) {
      push(diagonalList, diagonal);
      triedList[nowRow] = triedList[nowRow] || [];
      push(triedList[nowRow], nowCol);
      coords[nowRow] = nowCol;
      nowRow += 1;
    } else {
      diagonalList.pop();
      triedList[nowRow] = new Array;
      nowRow -= 1;
      nowCol = coords[nowRow];
      coords[nowRow] = FALSE;
    }
    updateNowCol();

    if (nowRow === length - 1) {
      coords[nowRow] = nowCol;
      push(solution, coords.toString());
      coords = resetList();
      solutionCount += 1;
    }
  }

  return {
    res: solution,
    count: solutionCount,
  };
};

findQueue();

module.exports = findQueue;
