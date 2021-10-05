# eslint

## 参考
- [自定义eslint](https://mp.weixin.qq.com/s/zDTRB9BQFbzj6SeAM7mVcA)
- [基于husky做的代码增量eslint](https://juejin.im/post/6865101730166767623?utm_source=gold_browser_extension)
- [eslint有哪些规则](https://www.cnblogs.com/fqh123/p/9967771.html)
- [eslint插件和babel的异同](https://mp.weixin.qq.com/s/73TYS14n_J4nRZrj9pCt0g)

## 原理

> ESLint 是一个代码检查工具，通过静态的分析，寻找有问题的模式或者代码。默认使用 [Espree](https://github.com/eslint/espree) 解析器将代码解析为 AST 抽象语法树，然后再对代码进行检查。

## 自定义 eslint 规则

```js
module.exports = {
  meta: {
    docs: {
      description: "最多参数允许参数",
    },
  },
  create: function (context) {
    return {
      FunctionDeclaration: (node) => {
        if (node.params.length > 3) {
          context.report({
            node,
            message: "参数最多不能超过 3 个",
          });
        }
      },
    };
  },
};
```



---



## 规则

```js
'no-trailing-spaces': 2, // 禁止行首
'no-multiple-empty-lines': 1, // 禁止多空行
```

