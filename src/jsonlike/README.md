# jsonlike

## 参考
  - https://mp.weixin.qq.com/s?__biz=MzUxMzcxMzE5Ng==&mid=2247489214&idx=1&sn=97cf38903a96d4758ab69b5edcee8fae&chksm=f951a3fdce262aeb953b513b0f122a84a9e479d37049e511803d3b84b884015e0d8433b20718&mpshare=1&scene=1&srcid=0720vngZNMPrbHyVIt0ODaC4#rd

---

## 替代方案
  - TOML
  - HJSON
  - HOCON
  - YAML

---

## JSON.stringify
[参考](https://juejin.im/post/5decf09de51d45584d238319?utm_source=gold_browser_extension)

### 特性

**对undefined、function、Symbol的处理**

- 作为对象属性值时，会跳过该属性
- 作为数组元素时，会序列化为`null`
- 作为单独值时，转为`undefined`
