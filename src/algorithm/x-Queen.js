
const isDiffLine = (pointX, pointY) => pointX !== pointY;
const getDiagonal = (coordX, coordY) => Math.abs(coordX - coordY);
const has = (list = [], item) => list.indexOf(item) !== -1;

function findQueue(length = 8) {
  const coords = Array.from({ length }, () => -1);
  const solution = [];
  const diagonalList = [];
  let solutionCount = 0;

  let diagonal;
  let nowRow = 0;
  let nowCol = 0;

  const updateNowCol = () => {
    nowCol = nowCol < length - 1 ? nowCol + 1 : 0;
    while (has(coords, nowCol)) {
      nowCol += 1;
    }
  };

  const updateDiagonal = () => {
    diagonal = getDiagonal(nowRow, nowCol);
    while (has(diagonalList, diagonal)) {
      updateNowCol();
      diagonal = getDiagonal(nowRow, nowCol);
    }
  };

  debugger;
  while (nowRow < length) {
    updateDiagonal();
    diagonalList.push(diagonal);
    coords[nowRow] = nowCol;
    nowRow++;
    updateNowCol();
  }

  return {
    res: solution,
    count: solutionCount,
  };
};

findQueue();

module.exports = findQueue;
