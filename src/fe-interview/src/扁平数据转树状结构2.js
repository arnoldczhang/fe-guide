/**
 * 题目：
 * 
 * 给定地域数据结构如下：
 * 
 * var obj = {
 *  a: 1,
 *  b: null,
 *  c: 'aaa',
 *  d: [1, 2, 3, 4],
 *  e: {  
 *    f: [{ aaa: 1 }, 'aa'],
 *    g: {
 *      h: 'aaa',
 *    },
 *  },
 * };
 * 
 * 转成类似如下结构：
 * [
 *    'a: 1',
 *    'b: null',
 *    'c: aaa',
 *    'd.0: 1',
 *    'd.1: 2',
 *    'd.2: 3',
 *    'd.3: 4',
 *    'e.f.0.aaa: 1',
 *    'e.f.1: aa',
 *    'e.g.h: aaa',
 * ]
 */
const transform = (obj, cach = [], prefix = '') => {
  Object.entries(obj).forEach(([key, value]) => {
    if (Array.isArray(value) || (typeof value === 'object' && value)) {
      transform(value, cach, `${prefix ? `${prefix}.${key}` : key}`);
    } else {
      cach.push(`${prefix ? `${prefix}.${key}` : key}: ${value}`)
    }
  });
  return cach;
};

console.log(transform(
  {
     a: 1,
     b: null,
     c: 'aaa',
     d: [1, 2, 3, 4],
     e: {  
       f: [{ aaa: 1 }, 'aa'],
       g: {
         h: 'aaa',
       },
     },
    }
));