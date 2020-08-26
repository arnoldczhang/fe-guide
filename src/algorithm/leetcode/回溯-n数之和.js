/**
 * 回溯-n数之和
 * 
 */

// 对象映射-两数之和（性能较差）
function twoSum(nums, target = 0) {
  const cach = {};
  return nums.reduce((res, pre) => {
    if (cach[pre] != undefined && cach[pre] != Infinity) {
      res.push([pre, cach[pre]]);
      cach[pre] = Infinity;
    } else {
      cach[target - pre] = pre;
    }
    return res;
  }, []);
}

// 双指针索引-两数之和 O(n)
function twoSum(nums, target = 0) {
  // nums = nums.sort((pre, next) => pre - next);
  const result = [];
  const { length } = nums;
  let start = 0;
  let end = length - 1;
  while (start < end) {
    const startVal = nums[start];
    const endVal = nums[end];
    const sum = startVal + endVal;
    if (sum > target) {
      while (start < end && nums[end] === endVal) end -= 1;
    } else if (sum < target) {
      while (start < end && nums[start] === startVal) start += 1;
    } else {
      result.push([startVal, endVal]);
      while (start < end && nums[start] === startVal) start += 1;
      while (start < end && nums[end] === endVal) end -= 1;
    }
  }
  return result;
}

// 三数之和 O(n^2)
function threeSum(nums, target = 0) {
  nums = nums.sort((pre, next) => pre - next);
  const { length } = nums;
  const result = [];
  for (let i = 0; i < length; i += 1) {
    const val = nums[i];
    const twoRes = twoSum(nums.slice(i + 1), target - val);
    twoRes.forEach((r) => {
      result.push(r.concat(val));
    });
    while (i < length - 1 && nums[i] === nums[i + 1]) i += 1;
  }
  return result;
}

// n数之和 O(n^n-1)
function nSum(
  nums,
  target = 0,
  n = 2,
) {
  const result = [];
  const { length } = nums;
  if (n > length || n < 2) return result;
  nums = nums.sort((pre, next) => pre - next);
  if (n === 2) return twoSum(nums, target);
  for (let i = 0; i < length; i += 1) {
    const val = nums[i];
    const lastSum = nSum(nums.slice(i + 1), target - val, n - 1);
    lastSum.forEach((sum) => {
      result.push([val].concat(sum));
    });
    // 跳过和当前相同的数字
    while (i < length - 1 && nums[i] === nums[i + 1]) i += 1;
  }
  return result;
}

console.log(twoSum([-1, 0, 1, 2, -1, -4]));
console.log(nSum([1,0,-1,0,-2,2], 0, 4));