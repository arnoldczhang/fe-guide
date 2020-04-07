const chromeLauncher = require('chrome-launcher');
// const puppeteer = require('puppeteer');
const lighthouse = require('lighthouse');
const config = require('lighthouse/lighthouse-core/config/lr-desktop-config.js');
const reportGenerator = require('lighthouse/lighthouse-core/report/report-generator');
// const request = require('request');
// const util = require('util');
const fs = require('fs');
const path = require('path');

type Opt = {
  chromeFlags?: string[],
  logLevel?: string;
  output?: string;
  port?: number;
};

type Chrome = {
  port?: number;
  kill: () => Promise<any>;
};

function launchChromeAndRunLighthouse(url: string, opts: Opt): any {
  return chromeLauncher.launch({ chromeFlags: opts.chromeFlags }).then((chrome: Chrome) => {
    opts.port = chrome.port;
    config.settings.locale = 'zh';
    return lighthouse(url, opts, config).then((results: any) => chrome.kill().then(() => {
      debugger;
      const json = reportGenerator.generateReport(results.lhr, 'json');
      fs.writeFileSync(path.join(__dirname, './test.json'), JSON.stringify(json, null, 4), 'utf-8');
      const newLhr = JSON.parse(JSON.stringify(results.lhr));
      const html = reportGenerator.generateReport(newLhr, 'html');
      fs.writeFileSync(path.join(__dirname, './test.html'), html, 'utf-8');
      return results.lhr;
    }));
  });
}

const opts: Opt = {
  chromeFlags: ['--show-paint-rects']
};

// Usage:
launchChromeAndRunLighthouse('https://www.jianshu.com/p/0f54075c33a1', opts)
  .then((results: any) => {
  // Use results!
  });
