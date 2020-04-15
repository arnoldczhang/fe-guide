/**
 * 图像识别一般分为几步：
 * 
 * 1. 放大图片（便于 tesserct 识别）
 * 2. 黑白化（颜色收归）
 * 3. 去干扰线
 * 4. 增强对比度
 * 5. 中值滤波（用像素点邻域灰度值的中值 来代替该像素点的灰度值，让周围的像素值接近真实的值从而消除孤立的噪声点）
 * 6. 高斯滤波（对一个像素的周围的像素给予更多的重视）
 * 
 */

const { createWorker } = require('tesseract.js');
const jpeg = require('jpeg-js');
const getPixels = require('get-pixels');
const gm = require('gm');//.subClass({ imageMagick: true });

const fs = require('fs');
const jimp = require('jimp');
const { join } = require('path');

const getPath = () => [
  join(__dirname, './example.png'),
  join(__dirname, './example2.png')
];

/**
 * parseSizeAndColor
 * 1. 放大图片（便于 tesserct 识别）
 * 2. 黑白化（颜色收归）
 * 
 * @param {String} imgIn 
 * @param {String} imgOut 
 */
async function parseSizeAndColor (imgIn, imgOut) {
  const img = await jimp.read(imgIn);
  await img.scale(5);
  await img.greyscale();
  await img.write(imgOut);
}

/**
 * parseDeNoise
 * 3. 去干扰线
 * 
 * @param {String} imgIn 
 * @param {String} imgOut 
 */
async function parseDeNoise (imgIn, imgOut) {
  const detach = 124; // 颜色阈值，一边试一边调，手动调到一个合适的水平
  const bgColor = 245;
  const whiteColor = 255;
  await new Promise((resolve, reject) => {
    getPixels(imgIn, (err, pixels) => {
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
          if (i === 0 || j === 0 || i === (x - 1) || j === (y - 1)) {
            pixels.set(i, j, 0, whiteColor);
            pixels.set(i, j, 1, whiteColor);
            pixels.set(i, j, 2, whiteColor);
          } else if (r > detach || g > detach || b > detach) {
            const count = [
              pixels.get(i - 1, j - 1, 0) > bgColor,
              pixels.get(i - 1, j + 1, 0) > bgColor,
              pixels.get(i - 1, j, 0) > bgColor,
              pixels.get(i + 1, j, 0) > bgColor,
              pixels.get(i + 1, j - 1, 0) > bgColor,
              pixels.get(i + 1, j + 1, 0) > bgColor,
              pixels.get(i, j - 1, 0) > bgColor,
              pixels.get(i, j + 1, 0) > bgColor,
            ].filter(v => v).length;

            // 判断像素一圈有多少白的，超过2，就转成白的
            if (count > 2) {
              pixels.set(i, j, 0, whiteColor);
              pixels.set(i, j, 1, whiteColor);
              pixels.set(i, j, 2, whiteColor);
            }
          }
        }
      }
      const info = {
        width: x,
        height: y,
        data: pixels.data
      };
      fs.writeFileSync(imgOut, jpeg.encode(info).data);
      resolve();
    });
  });
}

/**
 * parseWaveFilter
 * 4. 增强对比度
 * 5. 中值滤波（用像素点邻域灰度值的中值 来代替该像素点的灰度值，让周围的像素值接近真实的值从而消除孤立的噪声点）
 * 6. 高斯滤波（对一个像素的周围的像素给予更多的重视）
 * 
 * @param {String} imgIn 
 * @param {String} imgOut 
 */
async function parseWaveFilter (imgIn, imgOut) {
  await new Promise((resolve, reject) => {
    gm(imgIn)
      .despeckle()
      .contrast(-8)
      .median(10)
      .blur(8, 1.5)
      .write(imgOut, (err) => {
        if (err) {
          reject(err);
          return;
        }
        resolve(imgOut);
      });
  });
}

/**
 * recognizeImg
 * 图像识别
 * 
 * @param {String} imgPath 
 * @param {String} langPath 
 */
async function recognizeImg (imgPath, langPath) {
  const result = await (async() => {
    const worker = createWorker({ langPath });
    await worker.load();
    await worker.loadLanguage('eng');
    await worker.initialize('eng');
    await worker.setParameters({
      tessedit_char_whitelist: '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ',
    });
    const { data: { text } } = await worker.recognize(imgPath);
    await worker.terminate();
    return text;
  }) ();
  return result;
}

async function runImgRecognize () {
  const [imgInPath, imgOutPath] = getPath();
  const langPath = join(__dirname, './lang-data');
  await parseSizeAndColor(imgInPath, imgOutPath);
  await parseDeNoise(imgOutPath, imgOutPath);
  await parseWaveFilter(imgOutPath, imgOutPath);
  const result = await recognizeImg(imgOutPath, langPath);
  return result;
}

const recogPromise = runImgRecognize();
recogPromise.then((res) => console.log(res));
