
/**
 * 笛卡尔积
 * @param  {[type]} arr1 [description]
 * @param  {[type]} arr2 [description]
 * @return {[type]}      [description]
 *
 * A={x,y,z} and B={1,2,3}
 * => {x1, x2, x3, ...}
 * 
 */
function cartesianProduct(arr1, arr2) {
  if (!arr1 || !arr2 || !arr1.length || !arr2.length) {
    return null;
  }

  const result = [];
  for (let i = 0; i < arr1.length; i += 1) {
    for (let j = 0; j < arr2.length; j += 1) {
      result.push([arr1[i], arr2[j]]);
    }
  }
  return result;
};