const { traverse } = require('@babel/core');
const fs = require('fs-extra');
const path = require('path');
const resolve = require('resolve');
const {
  say,
  strify,
  transSetObjectToArray,
  projectDir,
  nodeDir,
  IMPORT,
  OUTPORT,
  DEFAULT,
  transformSync,
  MAX,
} = require('./utils');
const treeShake = require('./treeshaking-replace');

let count = 1;

const importMap = {};
const exportMap = {};
const visitedSet = new Set;

const defaultOutFileCb = (input) => {
  say(`Compile file: ${input} SUCCESS`);
};

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
        exportMap[filePath] = exportMap[filePath] || new Set;
        this.__export = exportMap[filePath];
      },
      exit(path) {
        const { callback = defaultOutFileCb } = options;
        callback(filePath);
        count += 1;
      }
    },
    ImportDeclaration(path) {
      const source = path.get('source');
      const specifiers = path.get('specifiers');
      const sourceName = source.node.value;
      const importPath = resolve.sync(sourceName, { basedir: fileDir });
      // FIXME 需要基于当前目录找node_modules
      setImmediate(() => {
        compileFile(sourceName, {
          basedir: /^\./.test(sourceName) ? fileDir : nodeDir,
        });
      });

      importMap[importPath] = importMap[importPath] || new Set;
      specifiers.forEach((specifier) => {
        const local = specifier.get('local').node;
        const imported = specifier.get('imported');
        let importedName;
        if (specifier.isImportDefaultSpecifier()) {
          importedName = DEFAULT;
        } else {
          importedName = imported.node.name;
        }
        // TODO 暂时只对标准的import {...}做处理，之后考虑更全面的监听变更
        importMap[importPath].add(importedName);
      });
    },
    ExportDefaultDeclaration(path) {
      // FIXME 第一次遍历不需要记录exports
      const exportNode = path.get('decleration').node;
      this.__export.add(strify([exportNode ? exportNode.name : DEFAULT]));
    },
    ExportNamedDeclaration(path) {
      // FIXME 第一次遍历不需要记录exports
      const pathDeclaration = path.get('declaration');
      if (pathDeclaration && pathDeclaration.node) {
        if (pathDeclaration.isVariableDeclaration()) {
          const declarations = pathDeclaration.get('declarations');
          if (declarations && declarations.length) {
            const exportName = declarations.map(declare => declare.get('id').node.name)[0];
            const exportValue = declarations.map(declare => declare.get('init'))[0];
            if (exportValue.isIdentifier()) {
              this.__export.add(strify([exportName, exportValue.node.name]));
            } else if (exportValue.isFunction() || exportValue.isCallExpression()) {
              this.__export.add(strify([exportName]));
            }
          }
        } else if (pathDeclaration.isFunctionDeclaration()) {
          const exportName = pathDeclaration.get('id').node.name;
          this.__export.add(strify([exportName]));
        }
      } else {
        path.node.specifiers.forEach((specifier) => {
          const key = specifier.local.name;
          const alias = specifier.exported.name;
          this.__export.add(strify([alias, key]));
        });
      }
    },
  });
};

const outputToFile = () => {
  transSetObjectToArray(importMap);
  transSetObjectToArray(exportMap);
  fs.writeFile(IMPORT, JSON.stringify(importMap, null, 2));
  say(`total: ${count}, success: ${count}`);
  say(`write to ${IMPORT}`);
  fs.writeFile(OUTPORT, JSON.stringify(exportMap, null, 2));
  say(`write to ${OUTPORT}`);
  say('DONE');
};

const analyzeImportFile = (filename = 'app.json', debugPages) => {
  let pages;
  if (Array.isArray(debugPages)) {
    pages = debugPages;
    pages.forEach((page) => {
      if (Array.isArray(page)) {
        const [ pageName, basedir ] = page;
        compileFile(pageName, { basedir });
      }
    });
  } else {
    pages = JSON.parse(
      fs.readFileSync(
        path.join(projectDir, filename),
        'utf-8'
      )
    ).pages;
    pages.forEach(page => compileFile(`./${page}.js`));
    compileFile('./app.js');
  }
  treeShake(importMap, exportMap, pages);
  // outputToFile();
};

analyzeImportFile();
// analyzeImportFile('app.json', [
//   [
//     './@wmfe/metrics-wxapp/src/utils/env.js',
//     nodeDir,
//   ]
// ]);
