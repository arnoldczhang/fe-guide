const {
  compileStart,
  compileJsFiles,
  compileFinish,
} = require('../build');

compileStart();
compileJsFiles();
compileFinish();
