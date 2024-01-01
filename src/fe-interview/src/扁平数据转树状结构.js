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
function transfer(arr = [], orderList = ['province', 'city', 'county']) {
  return arr.reduce((res, pre) => {
    let tempRes = res;
    orderList.forEach((order) => {
      let temp = pre[order];
      let item = tempRes.find(({ name }) => name === temp);
      if (!item) {
        item = {
          key: order,
          name: temp,
          children: [],
        };
        tempRes.push(item);
      }
      tempRes = item.children;
    });
    return res;
  }, []);
}