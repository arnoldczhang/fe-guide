const { traverse } = require('@babel/core');
const {
  valueToNode,
  expressionStatement,
  identifier,
} = require('@babel/types');
const babelGenerator = require('@babel/generator').default;
const uglifyJS = require('uglify-js');
const fs = require('fs-extra');
const path = require('path');
const resolve = require('resolve');
const {
  say,
  projectDir,
  nodeDir,
  uglify,
  transformSync,
  include,
  exclude,
  MAX,
  DEFAULT,
} = require('./utils');

let importMap;
let exportMap;
let pages;
let count = 1;

const map = {};
const visitedSet = new Set;

const compileFile = (filename, options = {}) => {
  if (count >= MAX - 1) return;
  const { basedir = projectDir } = options;
  const filePath = resolve.sync(filename, { basedir });
  if (visitedSet.has(filePath)) {
    return;
  }
  visitedSet.add(filePath);
  const fileDir = path.join(filePath, '../');
  const input = fs.readFileSync(filePath, 'utf-8');
  const { ast } = transformSync(input, filename);

  traverse(ast, {
    Program: {
      enter() {
        importMap[filePath] = importMap[filePath] || new Set;
      },
      exit(path) {
        count += 1;
        return;
      //   const usedMember = map[filePath] || new Set;
      //   Object.keys(this.__funcs).forEach((funcKey) => {
      //     const paths = this.__funcs[funcKey];
      //     const alias = this.__alias[funcKey];
      //     if (alias) {
      //       let used;
      //       alias.forEach((alia) => {
      //         if (used) return;
      //         if (usedMember.has(alia)) {
      //           used = true;
      //         }
      //       });

      //       if (!used) {
      //         paths.forEach(path => path.remove());
      //         this.__funcs[funcKey] = null;
      //       }
      //     } else if (!usedMember.has(funcKey)) {
      //       paths.forEach(path => path.remove());
      //       this.__funcs[funcKey] = null;
      //     }
      //   });

      //   this.__exports.forEach((specifiers) => {
      //     specifiers.forEach((specifier, i) => {
      //       const key = specifier.local.name;
      //       if (!this.__funcs[key]) {
      //         specifiers[i] = null;
      //       }
      //     });
      //   });
      }
    },
    ImportDeclaration(path) {
      const source = path.get('source');
      const sourceName = source.node.value;
      compileFile(sourceName, {
        basedir: /^\./.test(sourceName) ? fileDir : nodeDir,
      });
    },
    ExportDefaultDeclaration(path) {
      if (exclude(importMap[filePath], DEFAULT)) {
        path.remove();
      }
    },
    ExportNamedDeclaration(path) {
      const pathDeclaration = path.get('declaration');
      if (pathDeclaration && pathDeclaration.node) {
        const declarations = pathDeclaration.get('declarations');
        let exportName;
        if (pathDeclaration.isFunctionDeclaration()) {
          exportName = pathDeclaration.get('id').node.name;
        } else if (declarations && declarations.map) {
          exportName = declarations.map(declare => declare.get('id').node.name)[0];
        }
        if (include(importMap[filePath], exportName)) {
          try {
            pathDeclaration.replaceWithMultiple([
              pathDeclaration.node,
              identifier(`exports.${exportName} = ${exportName};`),
              identifier(`\n`),
            ]);
          } catch (err) {
            say(123, exportName, filePath, err);
          }
        } else {
          path.remove();
        }
      } else {
        // say(123, path.node);
        // path.replaceWithMultiple(path.node.specifiers.map((specifier) => {
        //   const key = specifier.local.name;
        //   const alias = specifier.exported.name;
        //   return identifier(`exports.${alias} = ${key};`);
        // }));
      }
    },
    VariableDeclarator(path) {
      // const initVal = path.get('init');
      // if (initVal.isFunctionExpression()) {
      //   const { name } = path.get('id').node;
      // }
    },
    FunctionDeclaration(path) {
      // const { name } = path.get('id').node;
      // if (name) {
      // }
    },
  });

  // let { code: babelCode } = babelGenerator(ast, {
  //   minified: false,
  // });

  // if (minified) {
  //   babelCode = uglify(babelCode).code;
  // }
};

const analyzeImportFile = () => {
  compileFile('./app.js');
  pages.forEach(page => compileFile(`./${page}.js`));
};


module.exports = (iMap, eMap, p) => {
  importMap = iMap;
  exportMap = eMap;
  pages = p;
  say('=============REPLACE===============');
  analyzeImportFile();
};

