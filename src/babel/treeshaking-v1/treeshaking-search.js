const { traverse, transformSync } = require('@babel/core');
const { valueToNode } = require('@babel/types');
const babelGenerator = require('@babel/generator').default;
const uglifyJS = require('uglify-js');
const fs = require('fs-extra');
const path = require('path');
const resolve = require('resolve');
const say = console.log;
const strify = (target = []) => target.toString();

const MAX = 300;
let count = 1;

const importMap = {};
const exportMap = {};
const visitedSet = new Set;

const projectDir = path.join(__dirname, '../../waimai_wxapp/src');
const nodeDir = path.join(__dirname, '../../waimai_wxapp/node_modules');
const IMPORT = './test1/import.json';
const OUTPORT = './test1/export.json';
const defaultOutFileCb = (input) => {
  say(`Compile file: ${input} SUCCESS`);
};

const transSetObjectToArray = (object = {}) =>
  Object.keys(object).forEach(key =>
    object[key] = Array.from(object[key])
  );

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
  const { ast } = transformSync(input, {
    filename,
    ast: true,
    code: false,
    sourceMap: true,
    babelrc: true,
    configFile: false,
  });

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
      const { node } = path;
      const source = path.get('source');
      const specifiers = path.get('specifiers');
      const sourceName = source.node.value;
      const importPath = resolve.sync(sourceName, { basedir: fileDir });
      importMap[importPath] = importMap[importPath] || new Set;
      specifiers.forEach((specifier) => {
        const local = specifier.get('local').node;
        const imported = specifier.get('imported');
        if (imported && imported.node) {
          importMap[importPath].add(imported.node.name);
          compileFile(sourceName, {
            basedir: /^\./.test(sourceName) ? fileDir : nodeDir,
          });
        }
      });
    },
    ExportDefaultDeclaration(path) {
      const exportNode = path.get('decleration').node;
      this.__export.add(strify([exportNode ? exportNode.name : 'default']));
    },
    ExportNamedDeclaration(path) {
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

const analyzeImportFile = (filename = 'app.json') => {
  const { pages } = JSON.parse(
    fs.readFileSync(
      path.join(projectDir, filename), 'utf-8'
    )
  );
  pages.forEach(page => compileFile(`./${page}.js`));
  compileFile('./app.js');
  outputToFile();
};

analyzeImportFile();
