/**
 * dp-编辑距离
 * 
 * 给你两个单词 word1 和 word2，
 * 请你计算出将 word1 转换成 word2 所使用的最少操作数 
 * 
 * 你可以对一个单词进行如下三种操作：
 * - 插入一个字符
 * - 删除一个字符
 * - 替换一个字符
 * 
 * 输入：word1 = "horse", word2 = "ros"
 * 输出：3
 * 
 * 题解：
 * if s1[i] == s2[j]:
 *  啥都别做（skip）
 *  i, j 同时向前移动
 * else:
 *  三选一：
 *    插入（insert）
 *    删除（delete）
 *    替换（replace）
 * 
 */

 // dp解
function minDistance(word1, word2) {
  const { length: l1 } = word1;
  const { length: l2 } = word2;
  const cach = new Map();

  const dp = (i, j) => {
    const key = `${i}${j}`;
    if (cach.has(key)) return cach.get(key);
    if (i === -1) return j + 1; // 删除
    if (j === -1) return i + 1; // 插入
    if (word1[i] === word2[j]) {
      cach.set(key, dp(i - 1, j - 1));
    } else {
      cach.set(key, Math.min(
        dp(i, j - 1) + 1, // 插入
        dp(i- 1, j) + 1,  // 删除
        dp(i- 1, j - 1) + 1,  // 替换
      ));
    }
    return cach.get(key);
  };
  return dp(l1 - 1, l2 - 1);
}

// dp-table解
function minDistance(word1, word2) {
  const { length: l1 } = word1;
  const { length: l2 } = word2;
  const dp = Array.from({ length: l1 + 1 }).fill(0);
  if (!l1 && !l2) return 0;
  if (!l1) return l2;
  if (!l2) return l1;
  dp.forEach((it, i, array) => {
      array[i] = array[i] || Array.from({ length: l2 + 1 }).fill(0);
      array[i][0] = i;
  });
  dp[0].forEach((it, j, array) => {
      array[j] = j;
  });
  for (let i = 1; i <= l1; i += 1) {
      for (let j = 1; j <= l2; j += 1) {
          if (word1[i - 1] === word2[j - 1]) {
              dp[i][j] = dp[i - 1][j - 1];
          } else {
              dp[i][j] = Math.min(
                  dp[i - 1][j] + 1,
                  dp[i][j - 1] + 1,
                  dp[i - 1][j - 1] + 1,
              );
          }
      }
  }
  return dp[l1][l2];
}

console.log(minDistance('a', 'b'));