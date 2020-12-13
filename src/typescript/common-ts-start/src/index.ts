// const path = require('path');
import {
  parseVue,
  transferVueTemplateToAst,
  transferJsToAst,
  traverseVueTemplateAst,
  traverseBabelAst,
} from './transfer';

import {
  read,
  readdir,
} from './fs';

// const init = (content) => {
//   const {
//     template,
//     script,
//   } = parseVue(content);
//   const tplAst = transferVueTemplateToAst(template);
//   const ast = transferJsToAst(script.content);  
// };

// readdir('/Users/zhangcheng08/website/kuaishou-fontend-abtest/src/common/');
