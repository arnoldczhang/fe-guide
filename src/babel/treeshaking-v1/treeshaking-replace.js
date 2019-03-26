const { traverse } = require('@babel/core');
const {
  valueToNode,
  expressionStatement,
  identifier,
} = require('@babel/types');
const babelGenerator = require('@babel/generator').default;
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
  getNodeName,
  getNodeValue,
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
      }
    },
    ImportDeclaration(path) {
      const source = path.get('source');
      const sourceName = getNodeValue(source);
      const specifiers = path.get('specifiers');
      const importQ = [];
      let isMixedImport = false;
      if (specifiers.length) {
        specifiers.forEach((specifier) => {
          if (
            specifier.isImportDefaultSpecifier()
              || specifier.isImportNamespaceSpecifier()
          ) {
            const name = getNodeName(specifier.get('local'));
            path.replaceWith(identifier(`const ${name} = require('${sourceName}')`));
            isMixedImport = true;
          } else {
            const local = getNodeName(specifier.get('local'));
            const imported = getNodeName(specifier.get('imported'));
            const isDiff = local !== imported;
            importQ.push(`${imported}${isDiff && local ? ': ' + local : ''}`);
          }
        });

        if (importQ.length) {
          const replaceNode = identifier(`const { ${importQ.toString()} } = require('${sourceName}')`);
          if (isMixedImport) {
            path.insertAfter([replaceNode]);
          } else {
            path.replaceWith(replaceNode);
          }
        }
      } else {
        path.remove();
      }
      setImmediate(() => {
        compileFile(sourceName, {
          basedir: /^\./.test(sourceName) ? fileDir : nodeDir,
        });
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
          exportName = getNodeName(pathDeclaration.get('id'));
        } else if (declarations && declarations.map) {
          exportName = declarations.map(declare => getNodeName(declare.get('id')))[0];
        }
        if (include(importMap[filePath], exportName)) {
          path.replaceWithMultiple([
            pathDeclaration.node,
            identifier(`exports.${exportName} = ${exportName};`),
            identifier(`\n`),
          ]);
        } else {
          path.remove();
        }
      } else {
        path.replaceWithMultiple(path.node.specifiers.map((specifier) => {
          const key = specifier.local.name;
          const alias = specifier.exported.name;
          return identifier(`exports.${alias} = ${key};`);
        }));
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

  let { code: babelCode } = babelGenerator(ast, {
    minified: false,
  });

  // const destPath = path.join(`${__dirname}/dest`, filename);
  // fs.copySync(filePath, /\.js$/.test(destPath) ? destPath : `${destPath}.js`);
  // fs.writeFile(
  //   destPath,
  //   babelCode,
  //   'utf8',
  //   (err) => {
  //     if (err) {
  //       say(err);
  //     }
  //   },
  // );

  // if (minified) {
  // babelCode = uglify(babelCode).code;
  // }
  say(babelCode);
};

const analyzeImportFile = (debug) => {
  pages.forEach((page) => {
    if (Array.isArray(page)) {
      const [ pageName, basedir ] = page;
      compileFile(pageName, { basedir });
    } else {
      compileFile(`./${page}.js`);
    }
  });
  if (!debug) {
    compileFile('./app.js');
  }
};


const treeShaking = (iMap = {}, eMap = {}, p = [
  [
    './test-lib.js',
    __dirname,
  ]
]) => {
  importMap = iMap;
  exportMap = eMap;
  pages = p;
  say('=============REPLACE===============');
  analyzeImportFile(p.length === 1);
};

treeShaking();

module.exports = treeShaking;
