import login from './login-flow';
import { getArg } from './utils';

const puppeteer = require('puppeteer');
const { argv } = require('yargs');

const intervalFn = async (page: ICO) => {
  await page.waitFor(3000);
  await page.evaluate(() => new Promise((resolve) => {
    const body = document.querySelector('.el-main');
    if (body) {
      const { scrollHeight } = body;
      const y = 0;
      const scrollFn = async (dist: number) => {
        body.scrollTo(0, dist + 10);
        if (dist <= scrollHeight) {
          setTimeout(scrollFn, 10, dist + 10);
        } else {
          resolve(dist);
        }
      };
      setTimeout(scrollFn, 10, y);
    } else {
      resolve();
    }
  }));
};

export default async function runBasicFlow({
  url,
  browser,
  needLogin = true,
} : {
  url: string,
  browser: ICO,
  needLogin?: boolean,
}) {
  const {
    user,
    pass,
    secret,
  } = getArg(argv);
  if (!user || !pass || !secret) {
    throw new Error('缺少');
  }

  if (needLogin) {
    await login(browser, {
      user,
      pass,
      secret,
    });
  }

  const page = await browser.newPage();
  await page.goto(url);
  await page.setViewport({ width: 1440, height: 766 });

  try {
    await intervalFn(page);
    await page.waitForSelector('selector');
    await page.click('selector');
    // ...
    await page.close();
  } catch (err) {
    console.log('err', err);
  }
}

async function run() {
  const browser = await puppeteer.launch({
    headless: false,
    defaultViewport: {
      width: 1440,
      height: 766,
    },
    args: ['--start-maximized'],
  });
  await runBasicFlow({
    url: 'http://pageA.com',
    browser,
  });
  await runBasicFlow({
    url: 'http://pageB.com',
    browser,
    needLogin: false,
  });
  await browser.close();
}

run();
