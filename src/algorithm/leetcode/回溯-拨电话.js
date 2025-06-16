/**
 * 17. 电话号码的字母组合
 * 
 * 给定一个仅包含数字 2-9 的字符串，返回所有它能表示的字母组合。答案可以按 任意顺序 返回。
 * 给出数字到字母的映射如下（与电话按键相同）。注意 1 不对应任何字母。
 * 
 * 示例 1：
 * 输入：digits = "23"
 * 输出：["ad","ae","af","bd","be","bf","cd","ce","cf"]
 * 示例 2：
 * 
 * 输入：digits = ""
 * 输出：[]
 * 示例 3：
 * 
 * 输入：digits = "2"
 * 输出：["a","b","c"]
 * 
 * O(3^n)
 * 
 * @param {*} digits 
 * @returns 
 */

// test
console.log(letterCombinations("23")); // ["ad","ae","af","bd","be","bf","cd","ce","cf"]
console.log(letterCombinations("")); // []
console.log(letterCombinations("2")); // ["a","b","c"]

// 直觉写法
var letterCombinations = function(digits) {
  const arr = [...digits];
  if (!arr.length) return []
  const numberMap = {
      2: ['a', 'b', 'c'],
      3: ['d', 'e', 'f'],
      4: ['g', 'h', 'i'],
      5: ['j', 'k', 'l'],
      6: ['m', 'n', 'o'],
      7: ['p', 'q', 'r', 's'],
      8: ['t', 'u', 'v'],
      9: ['w', 'x', 'y', 'z'],
  };

  let result = [];
  while(true) {
      if (!arr.length) break;
      const number = arr.shift();
      const digitList = numberMap[number];
      if(!result.length) {
          result.push(...digitList);
          continue;
      }
      const tempResult = result;
      result = [];
      for (const digit of digitList) {
          result.push(...tempResult.map(r => r + digit))
      }
  }
  return result;
};

/**
 * 状态好时的直觉写法
 * @param {*} digits 
 * @returns 
 */
var letterCombinations2 = function(digits) {
  const numberMap = {
    2: ['a', 'b', 'c'],
    3: ['d', 'e', 'f'],
    4: ['g', 'h', 'i'],
    5: ['j', 'k', 'l'],
    6: ['m', 'n', 'o'],
    7: ['p', 'q', 'r', 's'],
    8: ['t', 'u', 'v'],
    9: ['w', 'x', 'y', 'z'],
  };
  if (!digits.length) return [];
  const result = [];
  const backtrack = (n = 0, cach = []) => {
    if (cach.length === digits.length) return result.push(cach.join(''));

    const letters = numberMap[digits[n]];
    for (let i = 0; i < letters.length; i += 1) {
      cach.push(letters[i]);
      backtrack(n + 1, cach);
      cach.pop();
    }
  };

  backtrack();
  return result;
}
const MAPPING = ["", "", "abc", "def", "ghi", "jkl", "mno", "pqrs", "tuv", "wxyz"];
// 深度遍历
var letterCombinations3 = function(digits) {
    const n = digits.length;
    if (n === 0) {
        return [];
    }
    const path = Array(n); // 注意 path 长度一开始就是 n，不是空数组
    const ans = [];
    function dfs(i) {
        if (i === n) {
            console.log(path)
            ansu.push(path.join(""));
            return;
        }
        const letters = MAPPING[Number(digits[i])];
        for (const c of letters) {
            path[i] = c; // 直接覆盖
            dfs(i + 1);
        }
    }
    dfs(0);
    return ans;
};

// test
console.log(letterCombinations2("234"));