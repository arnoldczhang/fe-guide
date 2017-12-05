#!/usr/bin/env node

/*
  MIT License http://www.opensource.org/licenses/mit-license.php
  Author Arnold.Zhang
*/
const path = require("path");
const pojoLoader = require("../index.js");
const fs = require('fs');

const filepathRE = /(.*\/?)([^\.\/]+)\.[^\.]+$/;

try {
  const localPojoLoader = require.resolve(path.join(process.cwd(), "node_modules", "pojo-loader", "bin", "pojo-loader.js"));
  if(__filename !== localPojoLoader) {
    return require(localPojoLoader);
  }
} catch(e) {}
const yargs = require("yargs")
  .usage("pojo-loader " + require("../package.json").version + "\n" +
    "Usage: https://webpack.js.org/api/cli/\n" +
    "Usage without config file: pojo <entry> <output>\n" +
    "Usage with config file: pojo");

yargs.parse(process.argv.slice(2), (err, argv, output) => {
  const args = argv._;
  if (!args.length) throw new Error('entry is not existed');
  let fileName;
  const [entry = '', dist = ''] = args;
  const entryRes = entry && entry.match(filepathRE);
  const distRes = dist && dist.match(filepathRE);
  
  if (entryRes) {
    fileName = !distRes ? `${entryRes[1]}${entryRes[2]}.js` : distRes[0];
    const entryFile = fs.readFileSync(entry, 'utf-8');

    if (entryFile) {
      fs.writeFileSync(fileName, pojoLoader(entryFile));
    }

    else {
      process.exit(0);
      throw new Error('entry file is empty or not existed');
    }
  }

  else {
    process.exit(0);
    throw new Error('entry path`s format is not correct');
  }
});
