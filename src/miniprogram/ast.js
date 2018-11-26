/**
 * genASt
 * @param  {[type]} html wxml content
 * @param  {[type]} ast  default root ast or undefined
 * @return {[type]} ast     wxml to ast
 */
export default (wxml, ast) => {
  let _ast = ast;
  const htmlRe = /(?:<([a-zA-Z]+)(([\s]+[^=]+=(?:(['"])[^=]+\4|\{\{[^{}]+\}\}))*)\s*\/?>|<\/([a-zA-Z]+)>|[^<>]+)/g;
  let rootAst = _ast;
  let res = htmlRe.exec(wxml);
  let nowAst;

  while (res) {
    const [wholeHtml, startTag,,,, endTag] = res;
    if (!/^\s+$/g.test(wholeHtml)) {
      if (!endTag) {
        if (startTag) {
          nowAst = {
            tag: startTag,
            children: [],
          };
          if (rootAst) {
            _ast.children.push(nowAst);
            nowAst.parent = _ast;
            _ast = nowAst;
          } else {
            rootAst = nowAst;
            _ast = nowAst;
          }
        } else {
          nowAst = {
            text: wholeHtml,
          };
          _ast.children.push(nowAst);
          nowAst.parent = _ast;
        }
      } else {
        _ast = nowAst.parent || rootAst;
      }
    }
    res = htmlRe.exec(wxml);
  }
  return rootAst;
};
