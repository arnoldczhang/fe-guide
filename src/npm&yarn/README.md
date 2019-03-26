# npm

## 目录
<details>
<summary>展开更多</summary>

* [`npm&yarn基本操作&相关常识`](#npm&yarn基本操作&相关常识)
* [`package.json属性`](#package.json属性)
* [`npm安装原理`](#npm安装原理)

</details>

## 参考
-  https://github.com/diamont1001/blog/issues/11
- [现代化js封装库标准配置](https://github.com/yanhaijing/jslib-base)

## npm&yarn基本操作&相关常识

### 相关常识
- 格式
  - 大版本.次要版本.小版本
- 依赖
  - dependencies：正式环境要打包的
  - devDependencies：dev环境打包的
  - peerDependencies：依赖框架的插件
  - optionalDependencies：可选，只提供新功能
- 版本
  - 插入号^：大版本.x.x升级最新版（大版本不升级）
  - 波浪号~：大版本.次要版本.x升级最新版（大版本、次要版本不升级）
  - latest：最新版

### npm&yarn
- 初始化
  - npm init
  - yarn init
- 一键安装
  - npm i
  - npm install
  - yarn
- 指定安装
  - npm i xx -save/-save-dev
  - npm install xx -save/-save-dev
  - yarn add xx 空/-dev/-optional/-peer
- 卸载
  - npm uninstalll xx[@version]
  - yarn remove xx[@version]
- 更新
  - npm update xx[@version]
    - `npm升级会根据package的符号配置，不会直接更新到最新版`
  - yarn upgrade xx[@version]
    - `yarn直接升到最新版`
- 锁
  - yarn.lock
  - package-lock.json

### npm发布
- npm c ls
- npm config list
- npm config set @aa:registry http://r.npm.aa.com
  - `查看npm配置`
- npm login [--register=...]
  - `指定域登录（如果没登录的话）`
- package.json改版本号
- npm run xxx
  - `发布前打包一下`
- npm publish

### 其他操作

#### 查看模块 owner
- npm owner ls demo

#### 添加一个发布者
- npm owner add 用户名 项目名

#### 删除一个发布者
- npm owner rm 用户名 项目名

## package.json属性
* [module](https://github.com/rollup/rollup/wiki/pkg.module)
  - webpack或rollup打包时会优先引入module对应的文件
  - 主要用于做依赖分析，或npm包的复用
  - module属性是非标准属性，可参考[pr](https://github.com/browserify/resolve/pull/187)

## npm安装原理
1. preinstall
2. 确定首层依赖模块
3. 获取模块
  - package.json拿version、resolved等字段
  - 根据resolved到本地找缓存，没有再从仓库下载
  - 查找当前模块是否有依赖，有的话回到1
4. 模块扁平化
  - 所有模块放到根节点（npm3加入的dedupe）
  - 当发现有重复模块时，则将其丢弃（由于存在版本兼容范围，所以不一定要版本完全一致）
6. 执行工程自身生命周期
  - install
6. postinstall + prepublish + prepare

### npm2安装机制
![npm2](npm2.png)
弊端：相同模块大量冗余

### npm3安装机制
![npm3](npm3对比npm2.png)
弊端：相同模块部分冗余，如下图：
![npm3模块冗余](npm3模块冗余.png)

### npm去重
npm dedupe

