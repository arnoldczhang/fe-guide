# postcss

## 示例

### 分渠道加前缀

#### 目标
1. 通过css转ast，可以做部分预处理（比如区分渠道做样式注入等）
2. 结合postcss插件做属性拓展

#### 思路
less -> css2ast -> postcss
详见postcss.js

---

## hook和生命周期

```typescript
import postcss from 'postcss';
import * as postcssLess from 'postcss-less';

/**
 * hook参考这里 
 **/
const PLUGIN_PROPS = {
  /** 访问声明行（property: value）时触发 */
  Declaration: true,
  /** 访问所有选择器和声明块时触发 */
  Rule: true,
  /** 访问所有@开头的规则时触发 */
  AtRule: true,
  /** ast遍历前 且 所有文件被解析后触发 */
  Once: true,
  /** ast遍历后 且 文件被字符串化之前 */
  OnceExit: true,
  Root: true,
  postcssPlugin: true,
  prepare: true,
  Comment: true,
  DeclarationExit: true,
  RuleExit: true,
  AtRuleExit: true,
  CommentExit: true,
  RootExit: true,
};
```

---

## plugin

```typescript
function myPlugin(options: Record<string, any>) {
  return {
    postcssPlugin: 'postcss-myPlugin',
    Declaration(decl) {
      if (decl.prop === 'x-custom-prop') {
        decl.prop = 'xxx-custom-prop';
      }
    },
    Rule(rule) {
      if (rule.selector === '.xxx-klass') {
        // ...修改rule节点
      }
    },
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
      css.walkRules(function(ast: any) {
        // TODO
      });
    },
  };
}
```

---

## root对象

```typescript
{
  postcssPlugin: 'xxx',
  OnceExit(root, { result }) {
    /** 深度遍历整个ast */
    root.walk(callback);
    /** 遍历所有Declaration */
    root.walkDecls(callback);
    /** 遍历所有选择器 */
    root.walkRules(callback);
    /** @media、@font-face等 */
    root.walkAtRules(callback);
    /** 遍历root的直接子节点 */
    root.each(callback);
    root.append(node);
    root.prepend(node);
    /** 移除所有子节点 */
    root.removeAll();

    /** 处理流程结束后，添加告警的主要方式 */
    result.warn('Plugin finished processing.', { node: root });
    /** 包含所有插件添加时的告警和自定义信息 */
    result.messages;
    /** process时给的选项值 */
    result.opts;
  },
}
```

---

## 初始化选项值

```js
{
  /** 输入文件路径 */
  from: 'xxx',
  /** 输出文件路径 */
  to: 'xxx',
  /**  sourcemap生成规则 */
  map: 'boolean/string/object',
  /** 指定预解析器（less/scss），postcss默认只解析标准css */
  parser: require('postcss-scss'),
  /** parser + stringifier的别名，指定预解析器（less/scss），postcss默认只解析标准css */
  syntax: require('postcss-scss'),
  /** 解析时，是否尝试修复语法错误，而非直接抛错（处理不规范css时很有用） */
  safe: 'boolean',
}
```

---

## 运行

```typescript
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