export const removeComment = (file: string): string => (
  file
    .replace(/(\/\*)((?!\1)[\s\S])*\*\//g, '')
    .replace(/(\/\*)((?!\*\/)[\s\S])*\*\//g, '')
    .replace(/(<!--)((?!\1)[\s\S])*-->/g, '')
    .replace(/(<!--)((?!-->)[\s\S])*-->/g, '')
    .replace(/(\s|^)\/\/.*/g, '$1')
);

export const removeBlank = (input: string): string => (
  input.replace(/(?: |\{\{[^\{\}]*\}\})/g, '')
  // input.replace(/(?:\n|\t| |\{\{[^\{\}]*\}\})/g, '')
);

export const isBindEvent = (key: string): boolean => (
  /^(capture-)?(?:bind|catch)\:?\w+$/.test(key)
);

export const isElse = (key: string) => (
  /^wx:(?:elif)$/.test(key)
);

// https://developers.weixin.qq.com/miniprogram/dev/framework/custom-component/wxml-wxss.html
export const withoutPageSelector = (selector: string): boolean => (
  !/^(?:[a-zA-Z]|\:\:?|#)/.test(selector)
);
