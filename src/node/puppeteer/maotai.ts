async function maotai() {
  const browser = await puppeteer.launch({
    headless: false,
    defaultViewport: {
      width: 1440,
      height: 766,
    },
    args: [
      '--start-maximized',
      '--disable-web-security',
      '--disable-features=IsolateOrigins,site-per-process',
    ],
  });
  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 766 });
  await page.goto('https://login.tmall.com/');
  await page.evaluate(() => {
    Object.defineProperties(navigator, {
      webdriver: {
        get: () => undefined,
      },
    });
  });

  await page.waitForSelector('iframe#J_loginIframe');
  const iframeEl = await page.$(
    'iframe#J_loginIframe',
  );
  const frame = await iframeEl.contentFrame();
  await frame.waitForSelector('i.iconfont.icon-qrcode');
  await frame.tap('i.iconfont.icon-qrcode');
  await page.waitForNavigation();
  await page.goto('https://detail.tmall.com/item.htm?spm=a220m.1000858.1000725.61.73975041Y9ldB9&id=601943536532&areaId=310100&user_id=2279145851&cat_id=2&is_b=1&rn=55aebc8806743c7145a12bdc59d6ffd8');
  await page.waitForSelector('#J_LinkBuy');
  console.log(new Date);
  await page.tap('#J_LinkBuy');
}
maotai();