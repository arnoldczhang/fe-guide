const vueRender = require('vue-server-renderer');
const fs = require('fs');

module.exports = vueRender.createRenderer({
  template: fs.readFileSync('./views/vue/index.html', 'utf-8'),
});