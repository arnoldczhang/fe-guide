/**
 * 回溯-n数之和
 * 
 */

// 对象映射-两数之和（性能较差）
function twoSum(nums, target = 0) {
  const { length } = nums;
  const result = [];
  const visited = new Set();
  const cach = {};
  if (!length) return result;
  for (let i = 0; i < length; i += 1) {
    const val = nums[i];
    if (cach[val] != undefined) {
      if (visited.has(`${cach[val]}${val}`) || visited.has(`${val}${cach[val]}`)) {
        continue;
      }
      result.push([val, cach[val]]);
    } else {
      cach[target - val] = val;
    }
  }
  return result;
};

// 双指针索引-两数之和
function twoSum(nums, target = 0) {
  // nums = nums.sort((pre, next) => pre - next);
  const { length } = nums;
  let lo = 0;
  let hi = length - 1;
  const result = [];
  while (lo < hi) {
    const sum = nums[lo] + nums[hi];
    const left = nums[lo];
    const right = nums[hi];
    if (sum < target) {
      while (lo < hi && nums[lo] == left) lo++;
    } else if (sum > target) {
      while (lo < hi && nums[hi] == right) hi--;
    } else {
      result.push([left, right]);
      while (lo < hi && nums[lo] == left) lo++;
      while (lo < hi && nums[hi] == right) hi--;
    }
  }
  return result;
};

// 三数之和
function threeSum(nums, target = 0) {
  nums = nums.sort((pre, next) => pre - next);
  const { length } = nums;
  const result = [];
  const cached = {};
  for (let i = 0; i < length; i += 1) {
    const val = nums[i];
    const twoRes = twoSum(nums.slice(i + 1), target - val);
    if (twoRes.length) {
      twoRes.forEach((r) => {
        const el = r.concat(val);
        const elStr = el.sort((pre, next) => pre - next).join('');
        if (cached[elStr]) {
          return;
        }
        cached[elStr] = true;
        result.push(el);
      })
    }
  }
  return result;
}

console.log(twoSum([-1, 0, 1, 2, -1, -4]));
// console.log(threeSum([-1, 0, 1, 2, -1, -4]));