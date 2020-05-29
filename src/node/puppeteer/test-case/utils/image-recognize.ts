const { createWorker } = require('tesseract.js');
const jpeg = require('jpeg-js');
const getPixels = require('get-pixels');
const gm = require('gm');

const fs = require('fs');
const jimp = require('jimp');
const path = require('path');

export const getPath = () => [
  path.resolve('./dist/example.png'),
  path.resolve('./dist/example2.png'),
];

/**
 * parseSizeAndColor
 * 1. 放大图片（便于 tesserct 识别）
 * 2. 黑白化（颜色收归）
 *
 * @param {String} imgIn
 * @param {String} imgOut
 */
async function parseSizeAndColor(
  imgIn: string,
  imgOut: string,
) {
  try {
    const img = await jimp.read(imgIn);
    await img.scale(5);
    await img.greyscale();
    await img.write(imgOut);
  } catch (err) {
    console.log('jimp失败', err);
  }
}

/**
 * parseDeNoise
 * 3. 去干扰线
 *
 * @param {String} imgIn
 * @param {String} imgOut
 */
async function parseDeNoise(
  imgIn: string,
  imgOut: string,
) {
  const detach = 124; // 颜色阈值，一边试一边调，手动调到一个合适的水平
  const bgColor = 245;
  const whiteColor = 255;
  try {
    await new Promise((resolve, reject) => {
      getPixels(imgIn, (err: any, pixels: any) => {
        if (err) {
          reject(err);
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
  } catch (err) {
    console.log('去干扰失败', err);
  }
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
async function parseWaveFilter(
  imgIn: string,
  imgOut: string,
) {
  try {
    await new Promise((resolve, reject) => {
      gm(imgIn)
        .despeckle()
        .contrast(-8)
        .median(10)
        .blur(8, 1.5)
        .write(imgOut, (err: Error | void) => {
          if (err) {
            reject(err);
            return;
          }
          resolve(imgOut);
        });
    });
  } catch (err) {
    console.log('gm失败', err);
  }
}

/**
 * recognizeImg
 * 图像识别
 *
 * @param {String} imgPath
 * @param {String} langPath
 */
async function recognizeImg(
  imgPath: string,
  langPath: string,
): Promise<string | void> {
  try {
    const result = await (async () => {
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
    })();
    return result;
  } catch (err) {
    console.log('图片识别失败', err);
    return '';
  }
}

async function runImgRecognize() {
  const [imgInPath, imgOutPath] = getPath();
  const langPath = path.resolve('./dist/lang-data');
  await parseSizeAndColor(imgInPath, imgOutPath);
  await parseDeNoise(imgOutPath, imgOutPath);
  await parseWaveFilter(imgOutPath, imgOutPath);
  const result = await recognizeImg(imgOutPath, langPath);
  return result;
}

export default runImgRecognize;
