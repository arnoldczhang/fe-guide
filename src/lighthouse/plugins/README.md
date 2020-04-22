# lighthouse插件
> lighthouse支持通过[插件](https://github.com/GoogleChrome/lighthouse/blob/master/docs/plugins.md)形式，新增自定义统计指标，下面介绍下开发方式

## 插件目录
```
├── src --------------- 开发文件目录
│   ├── audits ------- 所有audits配置目录
│      ├── audit1.js ----- audit1的配置
│      ├── audit2.js ----- audit2的配置
│       └── auditN.js --------- auditN的配置
├── plugin.js --------------- 插件入口 
└── package.json ----- 配置文件
```

## 文件介绍

**package.json**

> 1. name 必须是 lighthouse-plugin-*开头
>
> 2. lighthouse 作为 peerDependencies，本地开发需要的放到 devDependencies


```json
{
  "name": "lighthouse-plugin-cats",
  "main": "plugin.js",
  "peerDependencies": {
    "lighthouse": "^5.6.0"
  },
  "devDependencies": {
    "lighthouse": "^5.6.0"
  }
}
```

**plugin.js**

```js
module.exports = {
  // 定义新的audit配置，配置路径为绝对路径，指向当前插件包内文件（比如src）
  audits: [{ path: 'lighthouse-plugin-arnold-diy/src/audits/has-cat-images.js' }],

  // 一个 plugin 即为一个 category，id 就是package.json 的 name，在这里可以定义这个 cateory 的一些属性
  category: {
    // 必须
    title: 'title',
    // 对 category 目的的描述
    description:
      'When integrated into your website effectively, cats deliver delight and bemusement.',
    // 对自定义 audits 的描述（只有当你引入了自定义 audits 才需要配置这个属性）
    manualDescription: 'manualDescription',
    // 必须，当前 category 包含的 audits，每个 audits 允许指定其 groupID
    auditRefs: [{ id: 'has-cat-images-id', weight: 1 }],
  },
  // 定义在 html 报告中的 audit-groups
  groups: {
    // groupID
    aa: {
      // 必须
      title: 'title',
      description: 'description',
    }
  },
};
```

**src/audits/audit1.js**

```js
const { Audit } = require('lighthouse');

class Audit1 extends Audit {
  static get meta() {
    return {
      id: 'header-police-audit-id',
      title: 'All headers stripped of debug data',
      failureTitle: 'Headers contained debug data',
      description: 'Pages should mask debug data in production.',
      // 配置需要的[收集项](https://github.com/GoogleChrome/lighthouse/blob/master/docs/plugins.md#available-artifacts)
      requiredArtifacts: ['devtoolsLogs'],
      // scoreDisplayMode: "numeric" | "binary" | "manual" | "informative"
    };
  }

  // 同步形式
  static audit(artifacts, context) {
    const images = artifacts.ImageElements;
    const catImages = images.filter((image) => image.src.toLowerCase().includes('cat'));

    return {
      score: catImages.length > 0 ? 1 : 0,
      numericValue: catImages.length,
    };
  }

  // 异步形式（context主要用于网络请求中，缓存统计结果，避免每次 audit 都要重新计算）
  // static async audit(artifacts, context) {
  //   const devtoolsLog = artifacts.devtoolsLogs[Audit.DEFAULT_PASS];
  //   const requests = await NetworkRecords.request(devtoolsLog, context);

  //   const badRequests = requests.filter(request =>
  //     request.responseHeaders.some(header => header.name.toLowerCase() === 'x-debug-data')
  //   );

  //   return {
  //     score: badRequests.length === 0 ? 1 : 0,
  //   };
  // }
}

module.exports = Audit1;
```

