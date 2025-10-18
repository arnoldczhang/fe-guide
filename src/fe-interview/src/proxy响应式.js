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
  const obj = {};
  return new Proxy(obj, {
    get(target, key) {
      if (key === Symbol.toPrimitive) return () => initial;
      return genData(initial + +key);
    },
  })
};

// test
const data = genData();
console.log(data[1] + 5); // 6
console.log(data[1][2][3] + 4); // 10