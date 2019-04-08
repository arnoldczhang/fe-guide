/**
 * 最长公共子序列
 * @param  {[type]} seq1 [description]
 * @param  {[type]} seq2 [description]
 * @return {[type]}      [description]
 */
function longestCommonSubsequence(seq1, seq2) {
  const result1 = getSubsequence(seq1, seq2);
  const result1Len = result1.length;

  if (result1Len >= Math.max(seq1.length, seq2.length) / 2) {
    return result1;
  }

  const result2 = getSubsequence(seq2, seq1);
  return result1Len > result2.length ? result1 : result2;
};

function getSubsequence(seq1, seq2) {
  const result = [];
  for (let i = 0, j = i; i < seq1.length; ) {
    const seq1Val = seq1[i];
    if (seq2.indexOf(seq1Val, j) > -1) {
      for ( ; j < seq2.length; ) {
        const seq2Val = seq2[j];
          if (seq1Val === seq2Val) {
            result.push(seq1Val);
            i += 1;
            j += 1;
            break;
          } else {
            j += 1;
          }
      }
    } else {
      i += 1;
    }
  }
  return result.join('');
};

// test
// console.log(longestCommonSubsequence('ABCDGH', 'AEDFHR'));
// console.log(longestCommonSubsequence('AGGTAB', 'GXTXAYB'));
