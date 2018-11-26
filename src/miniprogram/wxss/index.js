const {
  compileStart,
  compileImageFiles,
  compileWxssFiles,
  compileFinish,
} = require('../build');

const compileWxss = async () => {
  compileStart();
  await compileImageFiles();
  compileWxssFiles();
  compileFinish();
};
compileWxss();