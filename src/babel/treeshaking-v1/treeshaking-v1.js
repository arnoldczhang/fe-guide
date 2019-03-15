const { traverse, transformSync } = require('@babel/core');
const { valueToNode } = require('@babel/types');
const babelGenerator = require('@babel/generator').default;
const uglifyJS = require('uglify-js');
const fs = require('fs-extra');
const path = require('path');
const resolve = require('resolve');

const map = {};

const compileFile = (filename, options = {}) => {
  const filePath = resolve.sync(filename, __dirname);
  const { minified } = options;
  const input = fs.readFileSync(path.join(__dirname, filename), 'utf-8');
  const { ast } = transformSync(input, {
    filename,
    ast: true,
    code: false,
    sourceMap: true,
    babelrc: false,
    configFile: false,
    presets: [
      ["@babel/env", !minified ? {
        loose: false,
        modules: false,
      } : {
        loose: false,
      }],
      // "minify",
    ],
    plugins: [
      "minify-dead-code-elimination"
    ],
  });

  traverse(ast, {
    Program: {
      enter() {
        this.__funcs = {}; // 文件中声明的function
        this.__alias = {}; // function对应的别名
        this.__exports = [];
      },
      exit(path) {
        const usedMember = map[filePath] || new Set;
        Object.keys(this.__funcs).forEach((funcKey) => {
          const paths = this.__funcs[funcKey];
          const alias = this.__alias[funcKey];
          if (alias) {
            let used;
            alias.forEach((alia) => {
              if (used) return;
              if (usedMember.has(alia)) {
                used = true;
              }
            });

            if (!used) {
              paths.forEach(path => path.remove());
              this.__funcs[funcKey] = null;
            }
          } else if (!usedMember.has(funcKey)) {
            paths.forEach(path => path.remove());
            this.__funcs[funcKey] = null;
          }
        });

        this.__exports.forEach((specifiers) => {
          specifiers.forEach((specifier, i) => {
            const key = specifier.local.name;
            if (!this.__funcs[key]) {
              specifiers[i] = null;
            }
          });
        });
      }
    },
    ImportDeclaration(path) {
      const { node } = path;
      const source = path.get('source');
      const specifiers = path.get('specifiers');
      const usedVariables = specifiers.map(specifier => specifier.get('imported').node.name);
      const importPath = resolve.sync(source.node.value, __dirname);
      map[importPath] = map[importPath] || new Set;
      usedVariables.forEach(val => map[importPath].add(val));
    },
    ExportNamedDeclaration(path) {
      const pathDeclaration = path.get('declaration');
      if (pathDeclaration && pathDeclaration.node) {
        const declarations = pathDeclaration.get('declarations');
        const exportNames = declarations.map(declare => declare.get('id').node.name);
        if (!(map[filePath] || new Set).has(exportNames[0])) {
          path.remove();
        }
      } else {
        path.node.specifiers.forEach((specifier) => {
          const key = specifier.local.name;
          const alias = specifier.exported.name;
          this.__alias[key] = this.__alias[key] || new Set;
          this.__alias[key].add(alias);
        });
        this.__exports.push(path.node.specifiers);
      }
    },
    FunctionDeclaration(path) {
      const name = path.get('id').node.name;
      if (name) {
        this.__funcs[name] = this.__funcs[name] || [];
        this.__funcs[name].push(path);
      }
    },
  });

  let { code: babelCode } = babelGenerator(ast, {
    minified,
  });

  if (minified) {
    babelCode = uglifyJS.minify(babelCode, {
      output: {},
      compress: {
        dead_code: true,
        global_defs: {
          ENV: 'tt',
        }
      },
      mangle: {
        toplevel: false,
      },
    }).code;
  }
  console.log('\n===========');
  console.log(babelCode);
};

compileFile('./test.js', {
  minified: false,
});
compileFile('./test-lib.js', {
  minified: false,
});
