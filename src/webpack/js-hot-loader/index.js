// 无刷新热加载（具体实现还是需要框架支持，做部分节点的替换）
// 例子参考src/app.js
const path = require('path');
const hmrRE = /\/\*\s*HMR start\s*\*\/\n?([^\s\(\);]+)\(\);\n?\/\*\s*HMR end\s*\*\//;

module.exports = function (content, sourcemap) {
  const result = content.match(hmrRE);
  if (result) {
    const hotFragment = `
      if (module.hot) {
        module.hot.accept();
        if (module.hot.data) {
          ${result[1]} && ${result[1]}()();
        }
      }
    `;
    return `${content}${hotFragment}`;
  }  
  return `${content}`;
};
