// html转换
const posthtml = require('posthtml');

const html = `
  <component>
    <title>Super Title</title>
    <text>Awesome Text</text>
  </component>
`;

const result = posthtml()
  .use(require('posthtml-custom-elements')())
  .process(html, { sync: true })
  .html;

console.log(result);
/**
 * <div class="component">
    <title>Super Title</title>
    <div class="text">Awesome Text</div>
  </div>
 */