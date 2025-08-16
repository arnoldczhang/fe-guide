# Object.keys

## 推荐

- https://mp.weixin.qq.com/s/lEG4Ngm2T3qaqgM_j1niMQ

## 排序规则

1. 如果属性名的类型是 **Number**，那么 Object.keys 返回值是按照 key **从小到大**排序
2. 如果属性名的类型是 **String**，那么 Object.keys 返回值是按照属性**被创建的时间升序**排序
3. 如果属性名的类型是 **Symbol**，那么逻辑**同 String**

## 底层转换逻辑

1. toObject(o)
2. EnumerableOwnPropertyNames(o)
   - 由于 ownKeys 是 List 类型，需要先转成 Array
   - OwnPropertyKeys
3. CreateArrayFromList(o)

### toObject

| 类型 | 结果 |
| - | - |
| Undefined | 抛出 TypeError |
| Null | 抛出 TypeError |
| Boolean | 返回一个新的 Boolean 对象 |
| Number | 返回一个新的 Number 对象 |
| String | 返回一个新的 String 对象 |
| Symbol | 返回一个新的 Symbol 对象 |
| Object | 返回一个新的 直接将 Object 返回 |

### OwnPropertyKeys

- 声明变量 keys 值为一个空列表（List 类型）
- 把每个 Number 类型的属性，按数值大小升序，并依次添加到 keys 中
- 把每个 String 类型的属性，按创建时间升序，并依次添加到 keys 中
- 把每个 Symbol 类型的属性，按创建时间升序，并依次添加到 keys 中
- 将 keys 返回（return keys）

## 获取对象属性方式的对比

| 方式 | 继承属性 | 不可枚举属性 | Symbol |
| - | -: | :-: | :-: |
| for...in | √ | × | × |
| Reflect.ownKeys | × | √ | √ |
| Object.getOwnPropertyNames | × | √ | × |
| Object.keys | × | × | × |

## 结论

- 如果对象的属性类型是数字，字符与 Symbol 混合的，那么返回顺序永远是数字在前，然后是字符串，最后是 Symbol
- Symbol 类型最终还是会被过滤掉，因为 EnumerableOwnPropertyNames 不止给 Object.keys 用
- 排序规则也适用其他 API
