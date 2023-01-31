# treeshake

## 参考
  - https://www.zhihu.com/question/41922432

## 原理
  - ast搜索
  - tree shake（DCE）：找到需要的代码，灌入最终的结果 - 消灭不可能执行的代码
  - 传统DCE：找到执行不到的代码，从 AST 里清除 - 消灭没有用到的代码

---

## 本质
  - ES6 modules - 静态分析
  - modules定义：
    1. 只能作为模块顶层的语句出现，不能出现在 function 里面或是 if 里面
    2. import 的模块名只能是字符串常量。
    3. 不管 import 的语句出现的位置在哪里，在模块初始化的时候所有的 import 都必须已经导入完成。换句话说，ES6 imports are hoisted。
    4. import binding 是 immutable 的，类似 const。比如说你不能 import { a } from './a' 然后给 a 赋值个其他什么东西。

---

## 问题
Q：直接 import 的文件无法移除？

比如：
```js
import menu from './menu';
```

A：menu文件里可能操控原型，所以无法直接移除

---

## 举例

### webpack

```js
getContent({ runtimeTemplate, runtimeRequirements }) {
    runtimeRequirements.add(RuntimeGlobals.exports);
    runtimeRequirements.add(RuntimeGlobals.definePropertyGetters);
    // 未使用的模块, 在代码块前增加 unused harmony exports 注释标记
    const unusedPart =
      this.unusedExports.size > 1
        ? `/* unused harmony exports ${joinIterableWithComma(
            this.unusedExports
          )} */\n`
        : this.unusedExports.size > 0
        ? `/* unused harmony export ${first(this.unusedExports)} */\n`
        : "";
    const definitions = [];
    const orderedExportMap = Array.from(this.exportMap).sort(([a], [b]) =>
      a < b ? -1 : 1
    );
    // 对 harmony export 进行打标
    for (const [key, value] of orderedExportMap) {
      definitions.push(
        `\n/* harmony export */   ${JSON.stringify(
          key
        )}: ${runtimeTemplate.returningFunction(value)}`
      );
    }
    
    // 对 harmony export 进行打标
    const definePart =
      this.exportMap.size > 0
        ? `/* harmony export */ ${RuntimeGlobals.definePropertyGetters}(${
            this.exportsArgument
          }, {${definitions.join(",")}\n/* harmony export */ });\n`
        : "";
    return `${definePart}${unusedPart}`;
  }
```

### rollup

1. 从入口文件开始，组织依赖关系，并按文件生成 Module
2. 生成抽象语法树（Acorn），建立语句间的关联关系
3. 为每个节点打标，标记是否被使用
4. 生成代码（MagicString + position）去除无用代码

---

