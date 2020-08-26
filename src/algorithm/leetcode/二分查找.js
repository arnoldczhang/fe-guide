
function search(nums, target) {
  const { length } = nums;
  if (!length) return -1;
  let left = 0;
  let right = length;
  const cached = {};
  while(left < right) {
    const mid = Math.floor(left + (right - left) / 2);
    if (cached[mid]) return -1;
    const val = nums[mid];
    cached[mid] = true;
    if (val === target) {
      return mid;
    } else if (val < target) {
      left = mid;
    } else if (val > target) {
      right = mid;
    }
  }
  return -1;
}

console.log(search([1,0,3,5,9,12], 2));