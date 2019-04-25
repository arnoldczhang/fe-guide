// 素数检测

/**
 * 素数检测
 * @param  {[type]} num [description]
 * @return {[type]}     [description]
 *
 * 标准
 *
 * 1. 非负
 * 2. 整数
 * 3. > 3
 * 
 */
function checkPrimality(num) {
  if (num < 1) {
    return false;
  }

  if (num % 1) {
    return false;
  }

  if (num <= 3) {
    return true;
  }

  if (!(num % 2)) {
    return false;
  }

  for (let i = 3; i < Math.sqrt(num); i += 1) {
    if (!(num % i)) {
      return false;
    }
  }
  return true;
};