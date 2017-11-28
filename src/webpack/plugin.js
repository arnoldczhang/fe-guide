const ConcatSource = require("webpack-sources").ConcatSource;

class myPlugin {
  constructor(params) {
    this.params = params;
    this.init();
  }

  init() {

  }

  apply(compiler) {
    compiler.plugin('compilation', (compilation, params) => {
      compilation.plugin('build-module', (moduleArg) => {
      });

      compilation.plugin('optimize-chunk-assets', (chunks, callback) => {
        const hash = compilation.hash;
        const banner = `/*${this.params.title || ''}*/`;
        chunks.forEach(chunk => {
          const file = chunk.files;
          const comment = compilation.getPath(banner, {
            hash,
            chunk,
            file,
            basename: file,
            query: '',
          });
          return compilation.assets[file] = new ConcatSource(comment, "\n", compilation.assets[file]);
        });
        callback();
      });
    });
  }
}
module.exports = myPlugin;
