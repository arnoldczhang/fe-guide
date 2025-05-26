/**
 * 79. 单词搜索
 * 
 * 给定一个 m x n 二维字符网格 board 和一个字符串单词 word 。如果 word 存在于网格中，返回 true ；否则，返回 false 。
 * 单词必须按照字母顺序，通过相邻的单元格内的字母构成，其中“相邻”单元格是那些水平相邻或垂直相邻的单元格。同一个单元格内的字母不允许被重复使用。
 * 
 * 示例 1：
 * 输入：board = [["A","B","C","E"],["S","F","C","S"],["A","D","E","E"]], word = "ABCCED"
 * 输出：true
 * 
 * 示例 2：
 * 输入：board = [["A","B","C","E"],["S","F","C","S"],["A","D","E","E"]], word = "SEE"
 * 输出：true
 * 
 * 示例 3：
 * 输入：board = [["A","B","C","E"],["S","F","C","S"],["A","D","E","E"]], word = "ABCB"
 * 输出：false
 * 
 * @param {character[][]} board
 * @param {string} word
 * @return {boolean}
 * 
 * 提示：
 * 1. 多起点
 * 2. 查找前有多个优化点：字母数、倒序
 */

// test
console.log(exist([["A","B","C","E"],["S","F","C","S"],["A","D","E","E"]], "ABCCED")); // true
console.log(exist([["A","B","C","E"],["S","F","C","S"],["A","D","E","E"]], "SEE")); // true
console.log(exist([["A","B","C","E"],["S","F","C","S"],["A","D","E","E"]], "ABCB")); // false

var exist = function(board, word) {
  const al = board.length;
  const sl = board[0].length;
  const boardCountMap = new Map();
  const wordCountMap = new Map();
  for (let i = 0; i < al; i++) {
    for (let j = 0; j < sl; j++) {
      let count = boardCountMap.get(board[i][j]) || 0;
      boardCountMap.set(board[i][j], count + 1);
    }
  }
  for (let i = 0; i < word.length; i++) {
    let count = wordCountMap.get(word[i]) || 0;
    // 优化一：片段的某个字母的出现次数超出board中这个字母的次数，直接false
    if (count + 1 > (boardCountMap.get(word[i]) || 0)) return false;
    wordCountMap.set(word[i], count + 1);
  }
  // 优化二：如果片段的末尾的字母，出现次数很少，可以尝试倒过来匹配
  if (boardCountMap.get(word[0]) > boardCountMap.get(word[word.length - 1])) {
      word = word.split("").reverse().join("");
  }
  const backtrack = (n = 0, m = 0, arr = [], used = {}) => {
    if (arr.length === word.length) {
      if (arr.join('') === word) return true;
      return;
    }
    if (n < 0 || m < 0) return;
    if (n >= al || m >= sl) return;

    if (used[`${n},${m}`]) return;
    const item = board[n][m];
    if (item !== word[arr.length]) {
      return;
    }
    arr.push(item);
    used[`${n},${m}`] = true;
    if (backtrack(n + 1, m, arr, used)) return true;
    if (backtrack(n - 1, m, arr, used)) return true;
    if (backtrack(n, m + 1, arr, used)) return true;
    if (backtrack(n, m - 1, arr, used)) return true;
    arr.pop();
    used[`${n},${m}`] = false;
  };

  for (let i = 0; i < al; i += 1) {
    for (let j = 0; j < sl; j += 1) {
      if (backtrack(i, j)) {
        return true;
      }
    }
  }
  return false;
};