# postcss

## 示例

### 分渠道加前缀

#### 目标
1. 通过css转ast，可以做部分预处理（比如区分渠道做样式注入等）
2. 结合postcss插件做属性拓展

#### 思路
less -> css2ast -> postcss
详见postcss.js


## plugin

```ts
import postcss from 'postcss';
import * as postcssLess from 'postcss-less';

function myPlugin(options: Record<string, any>) {
  return {
    postcssPlugin: 'postcss-myPlugin',
    OnceExit(css: any, { result }: any) {
      // 相当于遍历type=decl的ast
      css.walkDecls(function(decl: any) {
        decl.value = 'relative';
      });
      // 遍历所有ast
      css.walk(function(ast: any) {
        // ast -> { parent, raw, source, text, type, selector, prop, value }
        // type有几种：comment、selector、decl
      });
      // 相当于遍历type=rule的ast
      css.walkRules(function(rule的ast: any) {
        // TODO
      });
    },
  };
}


const traverseLess = async (
  path: string,
) => {
  const content = read(path);
  const result = postcss()
    .use(myPlugin({}))
    .process(content, { syntax: postcssLess })
    .css;

  console.log(result);
};

traverseLess('mypath//xxx/xx/xx')
```