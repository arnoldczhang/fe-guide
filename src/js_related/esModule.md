# esModule

## 参考
  - https://zhuanlan.zhihu.com/p/40733281

## 细节
  - export
    - 对于单class，function，变量、及字面量的导出使用export default，
    禁止对复合对象字面量进行导出操作包括数组和对象
    - // lib1.js
      export default 1; // ok
      // lib2.js
      const a = 1;
      // lib3.js
      export default 1; // ok
      // lib4.js
      export default function name() {} // ok
      // lib5.js
      export default class name {}; // ok
      // lib6.js
      export default { a: 1, b: 2 } // not ok
  - import
    - 对于export default的导出，使用import xxx from；
    - 对于export name的导出，使用import * as lib from './lib'
    和 import “\{ a,b,c}" from './lib'；