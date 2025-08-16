/* eslint-disable no-await-in-loop */
import {
  screenshotDOMElement,
  genAuthCode,
} from './utils/login';
import runImgRecognize, {
  getPath,
} from './utils/image-recognize';

export default async function login(browser: ICO, {
  user,
  pass,
  secret,
}: {
  user: string,
  pass: string,
  secret: string,
}) {
  const page = await browser.newPage();
  const [imgPath] = getPath();
  const url: string = 'https://sso.login.cn';
  let unpassed: boolean = true;
  const maxTryTimes = 6;

  let times = 1;

  await page.goto(url);
  await page.waitForSelector('.fa-user');
  await page.type('input[name="user"]', user);
  await page.type('input[name="pass"]', pass);

  while (unpassed && times <= maxTryTimes) {
    try {
      await screenshotDOMElement(page, '.captcha', imgPath);
      const result = await runImgRecognize();
      console.log('图片验证码', result);
      await page.type('input[maxlength="4"]', result);
      await page.type('#verifyCode', genAuthCode(secret));
      await page.tap('button[type="submit"]');
      unpassed = await page.evaluate((): Promise<any> => new Promise((resolve) => {
        setTimeout(() => {
          resolve(!/target-page/.test(window.location.host));
        }, 1000);
      }));
    } catch (err) {
      console.log(err);
      if (err && err.message.indexOf('most likely because of a navigation') >= 0) {
        unpassed = false;
      }
    }
    times += 1;

    if (times > 6) {
      console.error('超出最大识别次数，失败');
      await page.evaluate(() => {
        window.alert('超出最大识别次数，失败');
        return 1;
      });
      await page.close();
      await browser.close();
    }
  }
  console.log('登录页已关闭');
  await page.close();
}
