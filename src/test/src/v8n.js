/**
 * v8n
 *
 * 参考：https://github.com/imbrn/v8n
 * 
 */
const v8n = require('v8n');

return v8n().number()
  .between(50, 100)
  .not.even()
  .test(71);