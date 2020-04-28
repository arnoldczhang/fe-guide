const { authenticator } = require('otplib');

export const genAuthCode = (secret: string): string => authenticator.generate(secret);

export async function screenshotDOMElement(
  page: ICO,
  selector: string,
  path: string,
  padding = 0,
) {
  try {
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
  } catch (err) {
    console.log(err);
    throw err;
  }
}
