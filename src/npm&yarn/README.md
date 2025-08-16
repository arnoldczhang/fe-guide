# npm

[TOC]

## 目录

<details>
<summary>展开更多</summary>

* [`基本操作&相关常识`](#基本操作&相关常识)
* [`package.json属性`](#package.json 属性)
* [`package-lock`](#package-lock.json)
* [`npm&yarn`](#两者差异)
* [`npm安装原理`](#npm安装原理)
* [`npm script`](#npm-script)
* [`npm link`](#npm-link)
* [`npm view`](#npm-view)
* [`npm的替代`](npm的替代)
* [`npm ci`](#npm-ci)
* [`pnpm`](#pnpm)
* [`yarn&pnpm`](#yarn&pnpm)

</details>

## 参考

- https://github.com/diamont1001/blog/issues/11
- [现代化 js 封装库标准配置](https://github.com/yanhaijing/jslib-base)
- [npm标准库字段配置](https://mp.weixin.qq.com/s/AiyVOwdYLwAecaJXqoGj6w)
- [node 依赖管理](https://mp.weixin.qq.com/s/XdOPPay8fpNBiH2ExW_EyQ)
- [前端工程-npm](https://juejin.im/post/5d08d3d3f265da1b7e103a4d?utm_medium=hao.caibaojian.com&utm_source=hao.caibaojian.com)
- [npm常用命令](https://blog.csdn.net/lianghecai52171314/article/details/109638556)

---

## 基本操作&相关常识

### 相关常识

#### 依赖

- dependencies：正式环境要打包的
- devDependencies：dev 环境打包的
- ```json
  {
    "name": "my-greate-express-middleware",
    "version": "1.0.0",
    "peerDependencies": {
      "express": "^3.0.0"
    }
  }
  ```
- optionalDependencies：可选，比 dependencies 优先级高，不建议使用
  * 即使这个依赖安装失败，也不影响整个安装过程
  * 程序应该自己处理安装失败时的情况
- bundledDependencies：数组形式，当使用 npm pack（压缩包形式）发布项目时，里面的包也会被一同打包

```json
{
  "name": "awesome-web-framework",
  "version": "1.0.0",
  "bundledDependencies": [
    "renderized", "super-streams"
  ]
}
```

#### 版本

[语义化版本控制规范](https://semver.org/lang/zh-CN/)

> 格式：大版本.次要版本.小版本

**大版本**

颠覆性的升级

**次要版本**

兼容同一个大版本内的 API 和用法

**小版本**

修复 bug 或者很细微的变更

#### 符号

- 插入号 ^：大版本.x.x 升级最新版（大版本不升级）
- 波浪号~：大版本.次要版本.x 升级最新版（大版本、次要版本不升级）
- latest：最新版
- alpha.x、beta.x、rc.x：预发布版本

#### 本地安装包

```json
{
  "dependencies": {
    "bar1": "file:../foo/bar1",
    "bar2": "file:~/foo/bar2",
    "bar3": "file:/foo/bar3"
  }
}
```

### 命令

#### 初始化

- npm init
- yarn init

#### 一键安装

- npm i
- npm install
- yarn

#### 指定安装

- npm i xx -save/-save-dev
- npm install xx -save/-save-dev
- yarn add xx 空/-dev/-optional/-peer

#### 卸载

- npm uninstalll xx[@version]
- yarn remove xx[@version]

#### 更新

- npm update xx[@version]
  + `npm升级会根据package的符号配置，不会直接更新到最新版`
- yarn upgrade xx[@version]
  + `yarn直接升到最新版`

#### 锁版本文件

- yarn.lock
- package-lock.json

#### 本地调试

- npm link

#### 普通发布

- npm c ls
- npm config list
- npm config set @aa:registry http://r.npm.aa.com
  - `查看npm配置`
- npm login [--register=...]
  - `指定域登录（如果没登录的话）`
- package.json 改版本号
- npm run xxx
  - `发布前打包一下`
- npm publish

#### 发beta版本

npm publish --tag beta

### 其他操作

#### 查看模块 owner

- npm owner ls demo

#### 添加一个发布者

- npm owner add 用户名 项目名

#### 删除一个发布者

- npm owner rm 用户名 项目名

### 安全性

**[socket-npm](https://socket.dev/blog/introducing-safe-npm)**

> 保护开发人员在使用 npm install 时免受恶意软件、拼写错误、安装脚本、抗议软件和遥测等方面的影响。
> 
> 暂不支持yarn和pnpm

---

## package.json 属性

* [module](https://github.com/rollup/rollup/wiki/pkg.module)
  - webpack 或 rollup 打包时会优先引入 module 对应的文件
  - 主要用于做依赖分析，或 npm 包的复用
  - module 属性是非标准属性，可参考 [pr](https://github.com/browserify/resolve/pull/187)
* resolutions
  * 锁定指定依赖的版本

---

## package-lock.json

npm 官网建议：把 package-lock.json 一起提交到代码库中，不要 ignore。
但是在执行 npm publish 的时候，它会被忽略而不会发布出去。

### 依赖包版本管理

- 在大版本相同的前提下，模块在 package.json 中的小版本 > lock.json 时，
  将安装该大版本下最新版本
- 在大版本相同的前提下，模块在 package.json 中的小版本 < lock.json 时，
  使用 lock.json 中的版本
- 在大版本不同的前提下，将根据 package.json 中大版本下最新版本进行更新
- package.json 中有记录，lock.json 没记录，install 后 lock.json 生成记录
- package.json 中没记录，lock.json 有记录，install 后移除模块，移除 lock.json 的记录

---

## 两者差异

### 安装方式

npm：串行的安装
yarn：并行安装

### 离线可用

npm：默认全部请求，5.x 版本之后，支持 `npm install xxx —prefer-offline` 优先使用缓存
yarn：默认支持，即使用本地缓存

### 控制台信息

npm：会列出完整依赖树
yarn：直接输出安装结果，报错日志清晰

---

## npm 安装原理

### 执行步骤

#### 1.preinstall

- 执行 npm install 命令前，npm 会自动执行 npm preinstall 钩子，可以做些什么

- ```json
    "scripts": {
        "preinstall": "node ./bin/preinstall.js"
    }
  ```
  
  #### 2.确定首层依赖模块

- `dependencies`

- `devDependencies`

#### 3.获取模块

- package.json 拿 `version`、`resolved` 等字段
- 根据 `resolved` 到本地找缓存，没有再从仓库下载
- 查找当前模块是否有依赖，有的话回到 1

#### 4.模块扁平化

- 所有模块放到根节点（npm3 加入的 dedupe）
- semver 兼容，semver 对应一段版本允许的范围
- 当发现有重复模块时，则将其丢弃（由于存在版本兼容范围，所以不一定要版本完全一致）

#### 5.执行工程自身生命周期

- install

#### 6.postinstall+prepublish+prepare

[npm hooks](https://segmentfault.com/a/1190000008832423)

### npm 模块安装机制

1. 查询 node_modules 是否已存在
- 存在，不重新安装
- 不存在
  + npm 向 registery 查询模块压缩包网址
  + 下载到根目录的.npm 里
  + 解压到当前目录的 node_modules

### npm2 安装机制

![npm2](npm2.png)

弊端：相同模块大量冗余

### npm3 安装机制

![npm3](npm3对比npm2.png)

弊端：相同模块部分冗余，如下图：
![npm3 模块冗余](npm3模块冗余.png)

### npm5

增加了 package-lock.json

### npm 去重

// TODO
npm dedupe

---

## npm-script

### npm-run

- 本地自动新建一个 shell
- 将 node_modules/.bin 的绝对路径加入 PATH，执行
- 结束后 PATH 恢复原样

### npm script执行提速

[方案](https://marvinh.dev/blog/speeding-up-javascript-ecosystem-part-4/)

### 参数传递

```js
npm run serve --params  // 参数params将转化成process.env.npm_config_params = true

npm run serve --params=123 // 参数params将转化成process.env.npm_config_params = 123

npm run serve -params  // 等同于--params参数

npm run serve params  // 将params参数添加到process.env.argv数组中

npm run serve -- --params  // 将--params参数添加到process.env.argv数组中

npm run serve -- params  // 将params参数添加到process.env.argv数组中
```

### 多命令运行

#### &&

- 串行执行
- 只要一个命令执行失败，则整个脚本终止

#### &

- 并行执行
- 第三方管理模块
  * script-runner
  * npm-run-all
  * redrun

---

## npm-link

> 假设存在 npm 包 A 开发目录，项目 B，项目 B 引用 npm 包 A，
> 
> 1. cd 到 npm 包 A 的目录，`npm link`，这样全局的 npm 包 A 就引用当前开发目录
> 2. cd 到项目 B，`npm link npm包A`

---

## npm-list

**查看包的父依赖、上层依赖**
npm list 包名 --depth=1000

---

## npm-view

**查看包所有版本**

```cmd
npm view xxx versions
```

---

## npm的替代

- pnpm
- npmd
- Ied

---

## npm可视化依赖图

[npmgraph](https://npmgraph.js.org/?q=ag-grid-vue3%4029.3.2) 极推荐！！！

---

## pnpm

### pnpm --filter

> 简版monorepo，参考[基于 pnpm + changesets 的 monorepo 最佳实践](https://juejin.cn/post/7181409989670961207#heading-5)
> 
> Git: [monorepo-example](https://github.com/luhc228/pnpm-changsets-monorepo-example)

#### 目录结构

```mark
pnpm-changsets-monorepo-example

├── LICENSE
├── package.json
├── packages
|  ├── a
|  |  ├── CHANGELOG.md
|  |  ├── index.ts
|  |  └── package.json
|  ├── b
|  |  ├── CHANGELOG.md
|  |  ├── index.ts
|  |  └── package.json
|  └── c
|     ├── CHANGELOG.md
|     ├── index.ts
|     └── package.json
```

**package.json（最外层）**

> pnpm i直接在最外层运行即可

```json
{
  "name": "test-test",
  "version": "1.0.0",
  "description": "",
  "main": "index.js",
  "scripts": {
    "watch": "pnpm --parallel -r run watch",
    "build": "pnpm -r run build"
  },
  "keywords": [],
  "author": "",
  "license": "ISC"
}
```

**pnpm-workspace.yaml**

```yaml
packages:
  # all packages in subdirs of packages/ and components/
  - 'packages/**'
```

**package.json（pkg1）**

> pkg相互直接可以直接引用，pnpm会处理 node_modules 依赖

```json
{
  "name": "pkg1",
  "version": "1.0.0",
  "description": "",
  "main": "index.js",
  "scripts": {
    "watch": "echo \"pkg1 watch\"",
    "build": "echo \"pkg1 builded\""
  },
  "dependencies": {
    "pkg2": "^1.0.0"
  },
  "keywords": [],
  "author": "",
  "license": "ISC"
}
```

### 使用changeset管理版本&发布

#### 命令
```json
{
  "scripts": {
    // 统一为packages/* 升级版本号
    "publish:first": "changeset",
    // 更新 package.json 和 CHANGELOG.md
    "publish:second": "pnpm changeset version",
    // 更新workspace依赖版本
    "publish:third": "pnpm install",
    // 发布所有package/*
    "publish:final": "pnpm changeset publish",
    // nx按需构建
    "build": "pnpm exec nx run-many --target=build --projects=app1 app2",
  },
}
```

#### 版本管理 ./changeset/config.json
```json
{
  "$schema": "https://unpkg.com/@changesets/config@3.1.1/schema.json",
  "changelog": "@changesets/cli/changelog",
  // 保持下面所有包的版本号保持统一
  "fixed": [
    "@tencent/mole-utils-server",
    "@tencent/mole-utils-client"
  ],
  // 允许独立发布（可以默认不填）
  "linked": [
    
  ],
  // 无需关注的包
  "ignore": [
    "common",
  ],
}
```

#### 发beta版

```sh
pnpm changeset pre enter beta
changeset
pnpm changeset version
pnpm changeset publish

<!-- 改了一些代码 -->
changeset
pnpm changeset version
pnpm changeset publish
```

#### 配置nx远程缓存
> 适用于nx21+：https://nx.dev/recipes/running-tasks/self-hosted-caching#open-api-specification

两件事：
1. 项目bash注入远程缓存服务器配置
2. 配置远程服务器（两个接口获取缓存和上传缓存）

**项目bash注入远程缓存服务器配置**

```bash

#!/bin/bash
 # 远程缓存构建函数
try_remote_build() {
    echo "Attempting remote cache build..."
    # 远程缓存服务器url
    export NX_SELF_HOSTED_REMOTE_CACHE_SERVER=your-server-remote-url
    export NX_SELF_HOSTED_REMOTE_CACHE_ACCESS_TOKEN=your-secure-token
    pnpm run build
}
 # 本地回退构建函数
local_fallback_build() {
    echo "Falling back to local build..."
    # 重置远程缓存信息，确保可以使用本地缓存，而不是跳过所有缓存
    export NX_SELF_HOSTED_REMOTE_CACHE_SERVER=""
    export NX_SELF_HOSTED_REMOTE_CACHE_ACCESS_TOKEN=""
    pnpm run build
}
 # 尝试远程构建
try_remote_build || {
    # 捕获错误后执行
    echo "▶️ Remote cache build failed! Reason: $?"

    # 执行降级构建
    local_fallback_build || {
        # 连本地构建都失败的处理
        echo "💥 Critical: Local build also failed!"
        exit 1
    }

    # 构建后
    echo "⚠️ Warning: Used local fallback build"
}
```

**配置远程服务器**

```js
const express = require('express');
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const app = express();
const PORT = 3000;
 // 配置参数
const CACHE_DIR = path.join(__dirname, 'nx-cache'); // 缓存存储目录
const AUTH_TOKEN = 'your-secure-token'; // 替换为实际密钥
 // 确保缓存目录存在
if (!fs.existsSync(CACHE_DIR)) {
  fs.mkdirSync(CACHE_DIR, { recursive: true });
}
 // 认证中间件
const authMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).send('Missing authentication token');
  }

  const [bearer, token] = authHeader.split(' ');

  if (bearer !== 'Bearer' || token !== AUTH_TOKEN) {
    return res.status(403).send('Invalid authentication token');
  }

  next();
};
 // 处理文件上传
app.put('/v1/cache/:hash', authMiddleware, express.raw({
  type: 'application/octet-stream',
  limit: '2gb' // 根据需求调整大小限制
}), (req, res) => {
  const hash = req.params.hash;
  const project = req.params.project;
  const contentLength = parseInt(req.headers['content-length'], 10);
  console.log(`PUT ${project}/v1/cache/${hash}, Size: ${contentLength} bytes`);

  if (!contentLength || isNaN(contentLength)) {
    return res.status(400).send('Content-Length header required');
  }
   const cachePath = path.resolve(CACHE_DIR, `./${project}`)
  if (!fs.existsSync(cachePath)) {
    fs.mkdirSync(cachePath, { recursive: true });
  }
   const filePath = path.join(cachePath, `${hash}.tar`);

  // 检查缓存是否已存在
  if (fs.existsSync(filePath)) {
    return res.status(409).send('Cache already exists');
  }
   // 写入缓存文件
  fs.writeFile(filePath, req.body, (err) => {
    if (err) {
      console.error(`Error saving cache ${hash}:`, err);
      return res.status(500).send('Internal server error');
    }

    res.status(202).end();
  });
});
 // 处理缓存下载
app.get('/v1/cache/:hash', authMiddleware, (req, res) => {
  const hash = req.params.hash;
  const project = req.params.project;
  console.log(`GET ${project}/v1/cache/${hash}`);
  const cachePath = path.resolve(CACHE_DIR, `./${project}`)
  const filePath = path.join(cachePath, `${hash}.tar`);

  if (!fs.existsSync(filePath)) {
    console.log(`cache miss`);
    return res.status(404).end();
  }
   // 设置正确的内容类型
  res.setHeader('Content-Type', 'application/octet-stream');

  // 创建文件流
  const fileStream = fs.createReadStream(filePath);

  fileStream.on('error', (err) => {
    console.error(`Error serving cache ${hash}:`, err);
    res.status(500).end();
  });

  console.log(`cache hit`);
  fileStream.pipe(res);
});
 // 启动服务器
app.listen(PORT, () => {
  console.log(`NX Cache Server running on port ${PORT}`);
  console.log(`Cache storage: ${CACHE_DIR}`);
});
```


### pnpm publish

[自动更新版本号](https://github.com/umijs/umi/pull/10719/files#diff-32824c984905bb02bc7ffcef96a77addd1f1602cff71a11fbbfdd7f53ee026bb)

### pnpm link

**1. 将当前包链接到全局**

```sh
pnpm link --global
```

**2. 使用全局已链接好的包**

```sh
pnpm link --global <包名>
```

### pnpm + nx + bundle-status
- [腾讯文档实践](https://mp.weixin.qq.com/s/JutlJ2k4XFM2r1MgeMcDgQ)
- [腾讯文档实践2](https://mp.weixin.qq.com/s/Xdv4VGObIvUYM-6ALWMf3A)

---

## npm-ci

参考[npm doc](https://docs.npmjs.com/cli/v8/commands/npm-ci)

npm ci 和 npm i 的区别如下：

- ci 要求项目已有 package-lock.json 或 npm-shrinkwrap.json
- 如果 package-lock.json 和 package.json 的依赖项不匹配，ci 会报错退出，而非更新 lock 文件
- ci 用于一次性安装依赖，而非新增某个依赖
- 如果 node_modules 文件夹已存在，ci 在开始安装前会删掉该文件夹
- ci 安装过程，不涉及 package-lock.json 和 package.json 的改动

### npm-shrinkwrap.json

> npm5 版本之前对 package-lock.json 的兼容，
> 
> 主要用于做精确的版本控制（依赖包、依赖包的依赖包），避免多人协作出现不同依赖包版本冲突问题

---

## yarn&pnpm

### npm3+和yarn

- 依赖半扁平（同一个包不同版本，包的安装位置不确定，依据package.json的顺序）

### pnpm

- 依赖完全扁平（包以软链形式链接到.pnpm包下扁平的各版本包）
- 扁平化算法简单很多，节省时间
- 当依赖了同一个包的不同版本时，只对变更的文件进行更新，不需要重复下载没有变更的部分
