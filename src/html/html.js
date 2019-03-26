const html = require('htmlparser2');

const html2ast = (rawHtml) => new Promise((resolve, reject) => {
  const parseHandler = new html.DefaultHandler((error, dom) => {
    if (error) {
      reject(error);
    } else {
      resolve(dom);
    }
  });
  const parser = new html.Parser(parseHandler);
  parser.parseComplete(rawHtml);
});

const ast2html = (ast, result = '') => {
  ast.forEach(({
    data,
    type,
    attribs,
    children,
    name,
  }) => {
    if (type === 'text') {
      result += data;
    } else if (type === 'tag' || type === 'script') {
      result += `<${name}`;
      Object.keys(attribs).forEach(key => result += ` ${key}="${attribs[key]}"`);
      result += '>';
      result += ast2html(children);
      result += `</${name}>`;
    }
  });
  return result;
};

const txt = "Xyz <script language= javascript>var foo = '<<bar>>';< /  script><!--<!-- Waah! -- -->";
html2ast(txt).then(
  res => console.log(ast2html(res)),
);
