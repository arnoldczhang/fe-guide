/**
 * 
 * 1. \B：获取非第一个数字
 * 2. (?=)：不消耗匹配的字符，仅用于插入
 * 
 * @param {*} num 
 * @returns 
 */
const percent = (num) => {
  const [pre, suffix] = String(num).split('.');
  return `${pre.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}${suffix ? `.${suffix}`: ''}`;
}

const percent2 = (num) => num.toLocaleString('en-US');

console.log(percent(42313123));
console.log(percent(12313123.3232));