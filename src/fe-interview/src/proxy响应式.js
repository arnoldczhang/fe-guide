/**
 * proxy响应式
 * 
 * - 运算时返回数字
 * - 一般使用返回对象
 * 
 * @param {*} initial 
 * @returns 
 */
const genData = (initial = 0) => {
  const protoData = {
    [Symbol.toPrimitive]() {
      return initial;
    },
  };
  return new Proxy(protoData, {
    get(obj, k) {
      if (k === Symbol.toPrimitive) return obj[k];
      return genData(initial + +k);
    },
  })
}

const data = genData();

console.log(data[1] + 5); // 6
console.log(data[1][2][3] + 4); // 10