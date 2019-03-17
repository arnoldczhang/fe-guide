/**
 * 样式解析流程
 * less -> css-ast -> postcss
 */
const css = require('css');
const path = require('path');
const {
  readFileSync,
  writeFile,
} = require('fs-extra');
const less = require('less');

const MEDIA = 'media';

const TT = 'tt';

const CURRENT = 1;

const getPath = filePath => path.join(__dirname, filePath);
const iterateRules = (rules) => {
  if (!rules) return;
  for (let i = 0, len = rules.length; i < len; ) {
    const rule = rules[i];
    if (!rule) continue;
    const { type, media } = rule;
    // 目前只对`@media xxx`标记做处理
    if (type === MEDIA) {
      // 匹配到的，移除标记，展开标记内容
      if (media === TT) {
        const childRules = rule.rules || [];
        rules.splice(i, CURRENT, ...iterateRules(childRules));
         i += childRules.length;
         len += childRules.length - CURRENT;
      // 未匹配到的，移除标记
      } else {
        rules.splice(i, CURRENT);
        len -= 1;
      }
    } else {
      iterateRules(rule.rules);
      i += 1;
    }
  }
  return rules;
};

const init = () => {
  const input = readFileSync(getPath('./test.less'), 'utf8');
  less.render(input, {
    plugins: [],
  }).then(({ css: output }) => {
    const ast = css.parse(output);
    const { rules } = ast.stylesheet;
    iterateRules(rules);
    writeFile(getPath('./test.css'), css.stringify(ast));
  });
};

init();
