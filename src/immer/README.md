# immer

## 三类数据
- base-data
- draft-data
- final-data

### base-data
- 原始值，值恒定不变
- draft-data的隐藏数据[[immer]]指向base-data

### draft-data
- 实现对base-data各层级数据的深度监听
- 底层数据指向base-data
- 数据变更（key或者index对应值变更），触发当前层级数据的浅拷贝
- 依次查找当前层级的父层级数据，同样执行浅拷贝，并更新值（变更的key或者index对应值）
- 下次变更，直接在更新值上操作即可，已和原始值无关

### final-data
- 由于draft-data是个监听器，直接返回无意义
- 遍历draft-data，依次取key（或index）和value（也可能是个监听器）
- 根据draft-data类型，新建对象（或数组）
- 依次赋值，key同上面的key，如果value是基本类型，直接返回上面的value，
  否则value取value的[[immer]]

## 原理
- 对象的引用
- 表象浅拷贝，实则选择性的深拷贝


