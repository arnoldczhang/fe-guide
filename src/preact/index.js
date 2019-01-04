const htm = require('htm');
const html = htm.bind(h);

function h(tag, props, ...children) {
  return { tag, props, children };
};

const Footer = props => html`<footer ...${props} />`
debugger;
const res = html`<webpack watch mode=production>
    <entry path="src/index.js" />
  </webpack>`;
console.log(JSON.stringify(res));

