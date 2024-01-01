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
function transfer(obj = {}, cach = {}, cachKey = []) {
  Object.entries(obj).forEach(([key, value]) => {
    const current = cachKey.concat(key);
    if (value && typeof value === 'object') {
      return transfer(value, cach, current);
    }
    cach[current.join('.')] = value;
  });
  return cach;
}

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