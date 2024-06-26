# lighthouse做小程序性能测试

## 目录
* [`小程序指标`](#小程序指标)
* [`代码编译`](#代码编译)
* [`指标测定`](#指标测定)
* [`自动化测试`](#自动化测试)

## 小程序指标

### 性能
- FCP
- FMP
- SI
- TTI

### 容器
- 小程序包体积
- 只需要调用一次的API，被重复调用
- 同一个API被大量调用
- 存在同步API调用
- 存在API调用超时
- 存在异步API使用相同参数
- 存在API无权调用
- 存在废弃API调用

### 最佳实践
| 序号 | 优化项 | 提升 |
| -------- | -----: | :-----: |
| 0 | 缓存了getSystemInfoSync()，移除了框架里的同步Storage方法调用 | 1500ms |
| 1 | Native.getSystemInfoSync().version 替换 getAlipayVersionSync | ？ |
| 2 | 首屏 getStorageSync 和 setStorageSync 调用优化 | 全部替换提升400ms |
| 3 | 梳理小程序依赖包、保内同步调用、生命周期外执行代码 | ？ |
| 4 | 小程序本地图片迁出主包方案（主包体积过大） | 减少500多张图片，体积2.2M->1M |
| 5 | 小程序非业务主流程页面分包方案（主包体积过大） | ？ |
| 6 | 梳理首屏接口依赖，接口时长 | ？ |
| 7 | 图片替换 webp 格式方案 | ？ |
| 8 | 替换某个包中的同步调用 | ？ |


