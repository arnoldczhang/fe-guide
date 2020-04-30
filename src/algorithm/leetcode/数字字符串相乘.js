/**
 * 题目：
 * 
 * 给定两个以字符串形式表示的非负整数 num1 和 num2，返回 num1 和 num2 的乘积，
 * 它们的乘积也表示为字符串形式
 * 
 * 要求：
 * num1 和 num2 的长度小于110。
 * num1 和 num2 只包含数字 0-9。
 * num1 和 num2 均不以零开头，除非是数字 0 本身。
 * 不能使用任何标准库的大数类型（比如 BigInteger）或直接将输入转换为整数来处理。
 * 
 * 
 */

function multiply(in1, in2) {
  const [n1, n2] = in1.length > in2.length ? [in1, in2] : [in2, in1];
  let n1list = n1.split('');
  let n2list = n2.split('');
  let result = Array.from({ length: n1list.length + n2list.length }).fill(0);
  n1list = n1list.reverse();
  n2list = n2list.reverse();
  n1list.forEach((v1, i) => {
    n2list.forEach((v2, j) => {
      result[i + j] += v1 * v2;
    });
  });

  result.forEach((val, i) => {
    if (val > 9) {
      result[i + 1] += Math.floor(val / 10);
      result[i] = val % 10;
    }
  });

  result = result.reverse();
  for (let n = 0; n < 1; n++) {
    if (result[0] === 0) {
      result.splice(0,1);
      n--;
    }
    return result.join("");
  }
}

// test
const num1 = '123';
const num2 = '5678';
multiply(num1, num2);