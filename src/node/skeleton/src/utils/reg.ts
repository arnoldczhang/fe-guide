export const removeComment = (file: string) => (
  file
    .replace(/(\/\*)((?!\1)[\s\S])*\*\//g, '')
    .replace(/(\/\*)((?!\*\/)[\s\S])*\*\//g, '')
    .replace(/(<!--)((?!\1)[\s\S])*-->/g, '')
    .replace(/(<!--)((?!-->)[\s\S])*-->/g, '')
    .replace(/(\s|^)\/\/.*/g, '$1')
);

export const isBindEvent = (key: string) => (
  /^(capture-)?(?:bind|catch)\:?\w+$/.test(key)
);

// https://developers.weixin.qq.com/miniprogram/dev/framework/custom-component/wxml-wxss.html
export const withoutPageSelector = (selector: string) => (
  !/^(?:[a-zA-Z]|\:\:?|#)/.test(selector)
);
