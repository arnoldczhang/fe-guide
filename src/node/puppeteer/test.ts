const { recognize } = require('tesseract.js');
const { authenticator } = require('otplib');
const jpeg = require('jpeg-js');
const getPixels = require('get-pixels');
const gm = require('gm').subClass({ imageMagick: true });

const puppeteer = require('puppeteer');
const fs = require('fs');
const jimp = require('jimp');
const { join } = require('path');

async function screenshotDOMElement(
  page: ICO,
  selector: string,
  path: string,
  padding = 0,
): Promise<ICO> {
  const h1Handler = await page.$(selector);
  const rect = await page.evaluate((element: ICO) => {
    try {
      const {
        x, y, width, height,
      } = element.getBoundingClientRect();
      return {
        x,
        y,
        width,
        height,
      };
    } catch (e) {
      return null;
    }
  }, h1Handler);
  const img = await page.screenshot({
    path,
    clip: rect ? {
      x: rect.x - padding,
      y: rect.y - padding,
      width: rect.width + padding * 2,
      height: rect.height + padding * 2
    } : null
  });
  return img;
}

async function imgParse(
  page: any,
  selector: string,
  imgPath: string,
): Promise<any> {
  const detach = 30; // 颜色阈值，一边试一边调，手动调到一个合适的水平
  await screenshotDOMElement(page, selector, imgPath);
  const img = await jimp.read(imgPath);
  await img.scale(5);
  await img.write(imgPath);
  debugger;
  // await new Promise((resolve, reject) => {
  //   gm(imgPath)
  //     // .threshold(detach)
  //     .noProfile()
  //     .sharpen(50)
  //     .write(imgPath, (err: any): void => {
  //       if (err) {
  //         reject(err);
  //         return;
  //       }
  //       resolve(imgPath);
  //     });
  // });
  await new Promise((resolve, reject) => {
    getPixels(imgPath, (err: any, pixels: ICO) => {
      if (err) {
        reject();
        return;
      }
      const x = pixels.shape[0];
      const y = pixels.shape[1];

      for (let i = 0; i < x; i += 1) {
        for (let j = 0; j < y; j += 1) {
          const r = pixels.get(i, j, 0);
          const g = pixels.get(i, j, 1);
          const b = pixels.get(i, j, 2);
          if (r > detach || g > detach || b > detach
            || i === 0 || j === 0 || i === (x - 1) || j === (y - 1)) {
            pixels.set(i, j, 0, 255);
            pixels.set(i, j, 1, 255);
            pixels.set(i, j, 2, 255);
          }
        }
      }
      const info = {
        width: x,
        height: y,
        data: pixels.data
      };
      fs.writeFileSync(imgPath, jpeg.encode(info).data);
      resolve();
    });
  });
}

async function aa(): Promise<void> {
  const imgPath = 'xxx.png';
  await imgParse(page, '.captcha', imgPath);
  const result = await recognize(
    imgPath,
    'eng',
    {
      langPath: join(__dirname, './lang-data'),
      tessedit_char_whitelist: '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ',
    }
  );
  console.log(111, result.data.text);
  const secret = '1111';
  await page.type('#verifyCode', authenticator.generate(secret));
  
  console.log(111);
}

aa();
