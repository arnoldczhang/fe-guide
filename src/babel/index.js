const babel = require('babel-core');
const babelTraverse = require("babel-traverse").default;
const babelGenerator = require('babel-generator').default;

const input = `
var obj = {
  ready: function() {
    owl.tryRun(function(){
      var self = this
      this.midasId = createMidasId()
      this.setData({
          midasId: this.midasId
      })
      try {
          self.triggerEvent('loadend', self.data.callbackParams, self.data.loadExtra)
      } catch (e) { 
          owl.errorLog('loadend-error', e.message)
      }

      var query = self.createSelectorQuery()
      query.selectViewport().fields({
          size: true
      });
    });
  },
};
`;

const { ast, metadata } = babel.transform(input, {
  sourceMap: true,
  presets: ["es2015", "stage-0"],
  plugins: [
    './src/babel/diy',
  ],
});
babelTraverse(ast, {
  CallExpression({ node }) {

  },
  VariableDeclarator({ node }) {

  },
});

const { code } = babelGenerator(ast);

console.log(code);