// 幂级

/**
 * 按位求幂级
 * @param  {[type]} set [description]
 * @return {[type]}     [description]
 *
 * Set { a, b, c }
 * 0 0 0  => {}
 * 0 0 1  => {c}
 * 0 1 0 => {b}
 * 0 1 1 => {b, c}
 * ...
 * 
 */
function bwPowerSet(set) {
  const setLen = set.length;
  const length = 2 ** setLen;
  const result = [];
  for (let i = 0; i < length; i += 1) {
    const temp = [];
    for (let j = 0; j < setLen; j += 1) {
      if (i & 1 << j) {
        temp.push(set[j]);
      }
    }
    result.push(temp);
  }
  return result;
};

// test
// console.log(bwPowerSet(['a', 'b', 'c', 'd']));





