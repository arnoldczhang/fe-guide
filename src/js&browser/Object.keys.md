# Object.keys

## 推荐
  - https://mp.weixin.qq.com/s/lEG4Ngm2T3qaqgM_j1niMQ

## 排序规则
  1. 如果属性名的类型是Number，那么Object.keys返回值是按照key从小到大排序
  2. 如果属性名的类型是String，那么Object.keys返回值是按照属性被创建的时间升序排序
  3. 如果属性名的类型是Symbol，那么逻辑同String相同

## 转换逻辑
  1. toObject(o)
  2. EnumerableOwnPropertyNames(o)
    - 由于ownKeys是List类型，需要先转成Array
    - OwnPropertyKeys
  3. CreateArrayFromList(o)

### toObject
类型 | 结果 |
--- | --- |
Undefined | 抛出TypeError |
Null | 抛出TypeError |
Boolean | 返回一个新的 Boolean 对象 |
Number | 返回一个新的 Number 对象 |
String | 返回一个新的 String 对象 |
Symbol | 返回一个新的 Symbol 对象 |
Object | 返回一个新的 直接将Object返回|

### OwnPropertyKeys
- 声明变量keys值为一个空列表（List类型）
- 把每个Number类型的属性，按数值大小升序排序，并依次添加到keys中
- 把每个String类型的属性，按创建时间升序排序，并依次添加到keys中
- 把每个Symbol类型的属性，按创建时间升序排序，并依次添加到keys中
- 将keys返回（return keys）

## 获取对象属性方式的对比

| 方式 | 继承属性 | 不可枚举属性 | Symbol |
| --- | -----: | :----: | :----: | :----: | :----: |
| for...in |  √ | × | × |
| Reflect.ownKeys | × | √ | √ |
| Object.getOwnPropertyNames | × | √ | × |
| Object.keys | × | × | × |

## 结论
  - 如果对象的属性类型是数字，字符与Symbol混合的，那么返回顺序永远是数字在前，然后是字符串，最后是Symbol
  - Symbol类型最终还是会被过滤掉，因为EnumerableOwnPropertyNames不止给Object.keys用
  - 排序规则也适用其他API，见【适用性】
