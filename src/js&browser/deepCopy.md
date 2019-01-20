## 参考
- https://yanhaijing.com/javascript/2018/10/10/clone-deep/

## 方式
- clone：创建新对象 + 递归
- cloneJSON：JSON.parse(JSON.stringify(object))
- cloneLoop：对象转为loopList，遍历拷贝
-cloneForce：对象转为loopList，拷贝前检测是否已拷贝过，保持引用