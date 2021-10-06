# lighthouse封装

## 字段
- settings
- passes
- audits
- categories
- groups

## 用法
```js
import Lighthouse from './index';

const lighthouse = new Lighthouse(url, opt, config);
const report = await lighthouse.run();

console.log(report.getJson()); // lighthouse-json结果
console.log(report.getHtml()); // lighthouse-html结果
```

## 其他

**lighthouse支持定义额外头部**

[参考](https://github.com/GoogleChrome/lighthouse/blob/master/docs/authenticated-pages.md)

命令形式
```cmd
lighthouse http://www.example.com --view --extra-headers="{\"Authorization\":\"...\"}"
```

js形式
```js
const result = await lighthouse('http://www.example.com', {
  extraHeaders: {
    Authorization: '...',
  },
});
```

### lighthouse支持cookie检测

```ts
import {
  LaunchedChrome,
  Options,
  launch
} from 'chrome-launcher';
import * as lighthouseLauncher from 'lighthouse';
import { generateReport } from 'lighthouse/lighthouse-core/report/report-generator';
import * as CDP from 'chrome-remote-interface';
import * as perfConfig from 'lighthouse/lighthouse-core/config/desktop-config';

const {
  settings: {
    throttlingMethod,
    ...otherSettings
  },
} = perfConfig;

const chromeConfig = {
  logLevel: 'info',
  chromeFlags: [
    '--headless',
    '--single-process',
    '--no-sandbox',
    '--no-first-run',
    '--no-zygote',
    '--disable-gpu',
    '--disable-web-security',
    '--disable-setuid-sandbox',
    '--disable-dev-shm-usage',
    '--disable-popup-blocking',
    '--mute-audio',
    '--autoplay-policy=user-gesture-required',
  ],
};

const config = {
  extends: 'lighthouse:default',
  settings: {
    ...otherSettings,
    onlyCategories,
    // skipAudits,
    locale: 'zh',
    maxWaitForFcp: '45000',
    extraHeaders: {},
  }
};

class LighthouseTest {
  chromeConfig = chromeConfig;
  
  config = config;
  
	async run(url, cookieStr) {
    // 启动 chrome-launcher，创建实例
    this.chrome = await launch(this.chromeConfig);
    this.chromeConfig.port = this.chrome.port;

    // chrome-remote 连接 chrome 实例
    const cdp = await new CDP({
      port: this.chromeConfig.port,
    });
    
    const cookies = cookieStr.replace(/\s+/g, '').split(';');

    if (cookies.length) {
      const { hostname: domain } = new URL(url);
      const promiseList = cookies.map((cookie) => {
        const result = /(\w+)?=(\S+)$/.exec(cookie);
        if (!result) {
          return Promise.resolve();
        }

        const [, name, value] = result;

        // 通过 chrome-remote 设置 cookie
        return cdp.Network.setCookie({
          name,
          value,
          domain,
        });
      });
      await Promise.all(promiseList);
    }

    // lighthouse-launcher 连接 chrome 实例
    this.report = await lighthouseLauncher(
      url,
      this.chromeConfig,
      this.config,
    );

    if (this.chrome) {
      await this.chrome.kill();
    }

    if (!this.report.lhr) {
      return '';
    }

    const html = generateReport(this.report.lhr, 'html') || '';

    // html 形式报告
    return html;
  }
}

// 运行
new LighthouseTest().run(url, cookies || '');
```

