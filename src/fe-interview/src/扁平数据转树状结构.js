/**
 * 题目：
 * 
 * 给定地域数据结构如下：
 * const arr = [
 *  {"province":"四川省", "city":"成都市", "county": "金牛区" },
 *  {"province":"四川省", "city":"绵阳市", "county": "平武县" },
 *  {"province":"上海市", "city":"上海市", "county": "长宁区" },
 * ];
 * 
 * 转成类似如下结构：
 * [{
 *  key: 'province',
 *  name: '四川省',
 *  children: [{
 *    key: 'city',
 *    name: '成都市',
 *    children: [{
 *      key: 'county',
 *      name: '金牛区',
 *    }],
 *  }],
 * }]
 * 
 */
function fn(arr, order = ['province', 'city',' county']) {
  return arr.reduce((res, pre) => {
    let tmp = res;
    order.forEach((o) => {
      const key = pre[o];
      const child = tmp.find((el) => el.name === key);
      if (child) {
        tmp = child.children;
      } else {
        const newChild = {
          key: o,
          name: pre[o],
          children: [],
        };
        tmp.push(newChild);
        tmp = newChild.children;
      }
    });
    return res;
  }, []);
}