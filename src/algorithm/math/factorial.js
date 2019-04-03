// 阶乘 - 非递归
function factorial(num) {
  if (num <= 1) return num;
  let result = num;
  while (num > 1) {
    result *= --num;
  }
  return result;
};

// test
// console.log(factorial(4));