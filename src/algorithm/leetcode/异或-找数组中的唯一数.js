/**
 * 找数组中的唯一数
 * 
 * 举例：
 * 给定：[1,3,3,17,1]
 * 
 * 唯一数是 17
 * 
 */
function findUniqueNumber(nums) {
  return nums.reduce((val, num) => val ^ num); 
}