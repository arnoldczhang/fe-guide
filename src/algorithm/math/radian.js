// 弧度与角

const ONE_PI = 180;

/**
 * 弧度 -> 角
 * @param  {[type]} radian [description]
 * @return {[type]}        [description]
 */
function radian2Degree(radian) {
  return ONE_PI * (radian / Math.PI);
};

/**
 * 角 -> 弧度
 * @param  {[type]} degree [description]
 * @return {[type]}        [description]
 */
function degree2Radian(degree) {
  return Math.PI * (degree / ONE_PI);
};
