const fs = require('fs');
const path = require('path');
const rp = require('request-promise');
const Template = require('webpack/lib/Template');
const CACH_KEY = 'CACH_KEY';
const FILE_CACH_KEY = 'FILE_CACH_KEY';
const ENTRY_KEY = 'ENTRY_KEY';
const CALLBACK_KEY = 'CALLBACK_KEY';

/**
 * 上传cdn
 * @param {*} param0 
 * @returns 
 */
const uploadMultiple = (
  /**
   * 
   */
) => {
  return Promise.resolve([]);
};

class DynamicImportHelper {
  constructor(options) {
    this.options = Object.assign({
      cdn: {
        /**
         * cdn配置
         */
      },
      projectName: 'projectName',
      // 入口文件名
      manifest: 'manifest',
    }, options);
  }

  init(compiler) {
    this.config = compiler.options;
    this.dependency = {};
    this.publicPath = `这里设置cdn链接根目录`;
  }

  getDir(dir = '') {
    const { options: { projectName } } = this;
    dir = dir.replace(/[\/\\]?([^\/\\]+)$/.exec(dir)[0], '');
    if (dir) {
      return `${projectName}${dir.charAt(0) === '/' ? '' : '/'}${dir}`;
    }
    return `${projectName}`;
  }

  getDllFiles() {
    // 获取dll打包资源
    return [];
  }

  async upload(files) {
    const { options: { cdn }, config } = this;
    const { output: { path: p } } = config;
    return Promise.all(files.map(file => uploadMultiple({
      ...cdn,
      dir: this.getDir(file),
      files: [path.join(p, file)],
    }))).then((urlArray) => (
      urlArray.reduce((res, url, index) => {
        res[files[index]] = url;
        return res;
      }, {})
    ));
  }

  genEntryContent({
    entryKey,
    dlls = [],
    files = [],
  }) {
    return `;(async function(window) {
      const dynamicFileCach = window['${FILE_CACH_KEY}'];

      const loadBatchScript = async (files) => Promise.all(
        files.filter(file => dynamicFileCach.indexOf(file) === -1)
          .map((file) => new Promise((resolve, reject) => {
            if (/\.js$/.test(file)) {
              const script = document.createElement('script');
              script.crossorigin = 'anonymous';
              script.src = file;
              script.onload = () => {
                dynamicFileCach.push(file);
                resolve();
              };
              script.onerror = reject;
              document.body.appendChild(script);
            } else if (/\.css$/.test(file)) {
              const link = document.createElement('link');
              link.setAttribute("rel", "stylesheet"); 
              link.setAttribute("type", "text/css"); 
              link.setAttribute("href", file); 
              document.head.appendChild(link);
              resolve();
            }
          }))
      );

      let url = '';

      try {
        throw new Error('message');
      } catch({ stack }) {
        [url] = /https?:\\/\{2\}[^:\\n]+/.exec(stack);
      }

      try {
        await loadBatchScript(${JSON.stringify(dlls)});
        await loadBatchScript(${JSON.stringify(files.slice(0, 1))});
        let cach;
        if (cach = window['${CACH_KEY}']) {
          window['${ENTRY_KEY}'][url] = () => cach['${entryKey}'].exports;
          await loadBatchScript(${JSON.stringify(files.slice(1))});
          window['${CALLBACK_KEY}'][url]();
        } else {
          throw new Error('未找到全局webpack缓存');
        }
      } catch ({ message }) {
        console.error(message);
      }
    } (window));`;
  }

  async genEntryFile() {
    const { dependency, options, config } = this;
    const { output: { path: p } } = config;
    const { projectName } = options;
    return Promise.all(Object.keys(dependency).map((depKey) => {
      const entryName = `${projectName}-${depKey}.js`;
      const dep = dependency[depKey];
      const content = this.genEntryContent(dep);
      const file = path.join(p, entryName);
      fs.writeFileSync(file, content);
      return this.upload([entryName]).then((cdnFileMap) => {
        dep.entryUrl = cdnFileMap[entryName];
        console.log(`${entryName} 生成成功，地址: ${dep.entryUrl}`);
      });
    }));
  }

  interopInitialize(compiler) {
    compiler.hooks.beforeRun.tapAsync('updateddddOutput', (compiler, callback) => {
      const { options: { output } } = compiler;
      // 将内联资源指向cdn地址
      output.publicPath = this.publicPath;
      callback();
    });
  }

  interopCompilation(compiler) {
    compiler.hooks.compilation.tap(
      "exportWebpackddddCachToGlobal",
      (compilation) => {
        const { mainTemplate } = compilation;
        mainTemplate.hooks.localVars.tap('bindGloddddbalVar', (source, chunk, hash) => {
          const { name } = chunk;
          if (name === this.options.manifest) {
            console.log(`发现入口文件：${name}`);
            const buf = [source];
            buf.push(`
              window['${CACH_KEY}'] = installedModules;
            `);
            return Template.asString(buf);
          }
          return source;
        });
      }
    );
  }

  interopAfterEmit(compiler) {
    console.log('下面进行编译文件上传cdn处理...');
    compiler.hooks.afterEmit.tapPromise(
      'collectAndUploaddddResources',
      async (compilation) => {
        const cdnFileMap = await this.upload(Object.keys(compilation.assets));
        Array.from(compilation.entrypoints.keys()).map((entryName) => {
          const entrypoint = compilation.entrypoints.get(entryName);
          const files = entrypoint.getFiles();
          const { entryModule: { id } } = entrypoint.chunks.find(
            chunk => chunk.name === entryName
          );
          this.dependency[entryName] = {
            entryKey: id,
            dlls: this.getDllFiles(),
            files: files.map(fileName => cdnFileMap[fileName]),
          };
        });
      }
    );
  }

  interopDone(compiler) {
    compiler.hooks.done.tapAsync('genEntryddddFile', async (stats, callback) => {
      console.log('下面生成入口文件');
      await this.genEntryFile();
      const { endTime, startTime } = stats;
      const { dependency } = this;
      console.log(`编译完成，耗时：${endTime - startTime}毫秒`);
      console.log(`入口文件参考：
      ${Object.keys(dependency).map(key => `${key}: ${dependency[key].entryUrl}`).join(`
`)}`);
      callback();
    });
  }

  apply(compiler) {
    this.init(compiler);
    this.interopInitialize(compiler);
    this.interopCompilation(compiler);
    this.interopAfterEmit(compiler);
    this.interopDone(compiler);
  }
}

module.exports = DynamicImportHelper;