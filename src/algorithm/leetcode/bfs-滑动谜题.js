/**
 * 题目：
 * bfs-滑动谜题
 * 
 * 题解：
 * - 问题转变为单次可移动方向
 * - 记录走过的路径，去重
 * - 同转盘锁
 */
function slidingPuzzle(board, target = [[1,2,3], [4,5,0]]) {
  const q = [];
  const visited = new Set();
  const targetVal = target.join().replace(/,/g, '');
  const boardVal = board.join().replace(/,/g, '');
  let step = 0;
  visited.add(boardVal);
  q.push(boardVal);

  const getAdj = (node) => {
    const index = node.indexOf('0');
    const nebour = [
      [1, 3],
      [0, 4, 2],
      [1, 5],
      [0, 4],
      [3, 1, 5],
      [4, 2],
    ];
    return nebour[index].reduce((res, pre) => {
      const item = node.split('');
      const temp = item[pre];
      item[pre] = item[index];
      item[index] = temp;
      const itemVal = item.join('');
      if (!visited.has(itemVal)) {
        res.push(itemVal);
        visited.add(itemVal);
      }
      return res;
    }, []);
  };

  while (q.length) {
    const { length } = q;
    for (let i = 0; i < length; i += 1) {
      const cur = q.shift();
      if (cur === targetVal) {
        return step;
      }

      for (const item of getAdj(cur)) {
        q.push(item);
      }
    }
    step += 1;
  }
  return -1;
}

debugger;
console.log(slidingPuzzle([[1,2,3],[5,4,0]]));
