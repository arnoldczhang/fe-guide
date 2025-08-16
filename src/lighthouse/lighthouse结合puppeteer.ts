import Lighthouse from '../node/lighthouse';

const fetch = require("node-fetch");
const puppeteer = require('puppeteer');
const {URL} = require('url');

async function getLoginData(): Promise<ICO> {
  const data = await Promise.resolve(/* 获取数据 */);
  return { data };
}

async function runPuppeteer(url: string): Promise<any> {
  const { data: loginData } = await getLoginData();
  const browser = await puppeteer.launch({
    args: [
      '--no-sandbox',
      '--headless',
      '--disable-gpu',
      '--show-paint-rects',
    ],
    defaultViewport: null,
  });
  const page = await browser.newPage();
  await page.goto(url);
  loginData.expires = new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toUTCString();
  await page.evaluate((data: ICO) => {
    window.localStorage.setItem('test_key', JSON.stringify(data));
  }, loginData);
  return browser;
}

async function testLighthouseTest(url: string): Promise<any> {
  const browser = await runPuppeteer(url);
  const lighthouse = new Lighthouse(url, {
    initLighthouseConfig: (config: ICO) => ({
      ...config,
      settings: {
        ...config.settings,
        locale: 'zh',
        throttlingMethod: 'provided',
      },
    }),
    initChromeConfig: () => ({
      logLevel: 'info',
      chromeFlags: [
        '--no-sandbox',
        '--headless',
        '--disable-gpu',
        '--show-paint-rects',
      ],
      port: (new URL(browser.wsEndpoint())).port,
      disableStorageReset: true,
    })
  });
  const report = await lighthouse.run();
  if (report instanceof Lighthouse) {
    fs.writeFileSync('result.html', report.getHtml(), 'utf-8');
  }
  await browser.close();
}

testLighthouseTest('');