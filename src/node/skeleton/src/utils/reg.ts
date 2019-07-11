// test
export const isNpmComponent = (path: string): boolean => (
  /^~@/.test(path)
);

export const isBindEvent = (key: string): boolean => (
  /^(capture-)?(?:bind|catch)\:?\w+$/.test(key)
);

export const isElse = (key: string): boolean => (
  /^wx:(?:elif)$/.test(key)
);

export const isId = (key: string): boolean => (
  /^#?id$/.test(key)
);

export const isKlass = (key: string): boolean => (
  /^.?class$/.test(key)
);

export const hasWxVariable = (input: string): boolean => (
  /\{\{[^\{\}]*\}\}/.test(input)
);

// https://developers.weixin.qq.com/miniprogram/dev/framework/custom-component/wxml-wxss.html
export const withoutPageSelector = (selector: string): boolean => (
  !/(?:^[a-zA-Z]|^\:\:?|#|\[)/.test(selector)
);

// match
export const splitWxAttrs = (input: string): string[] => (
  input.match(/(\s*[^\{\}\s]+|\s*\{\{[^\{\}]+\}\})+?/g)
    .reduce((res: string[], attr: string) => {
      const index = Math.max(res.length - 1, 0);
      if (!/^\s/.test(attr)) {
        res[index] = `${res[index] || ''}${attr}`;
      } else {
        res.push(attr.trim());
      }
      return res;
    }, [])
);

// page#aa
// .aa#bb
// #aa
// #aa:focus
// #aa.bb:focus
// page#aa.bb:focus
export const matchIdStyle = (key: string): any[] | null => (
  key.match(/(?:^([\.\w]+)?(#[^#\.\:]+)(\.\w+)?(\:[a-z]+)?$)/)
);

export const interceptWxVariable = (
  input: string,
  replacement?: string,
): string => (
  input.replace(/\{\{([^\{\}]+)\}\}/, replacement || '$1')
);

export const replacePseudo = (
  input: string,
  replacement?: string,
): string => (
  input.replace(/:[a-zA-Z\-]+/g, replacement || '')
);

export const removeComment = (file: string): string => (
  file
    .replace(/(\/\*)((?!\1)[\s\S])*\*\//g, '')
    .replace(/(\/\*)((?!\*\/)[\s\S])*\*\//g, '')
    .replace(/(<!--)((?!\1)[\s\S])*-->/g, '')
    .replace(/(<!--)((?!-->)[\s\S])*-->/g, '')
    .replace(/(\s|^)\/\/.*/g, '$1')
);

export const removeBlank = (input: string): string => (
  input.replace(/(?:\n|\t|^ +| +$|\{\{[^\{\}]*\}\})/g, '')
);
