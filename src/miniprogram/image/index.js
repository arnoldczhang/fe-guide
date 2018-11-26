const {
  compileStart,
  compileImageFiles,
  compileFinish,
} = require('../build');

const compileImage = async () => {
  compileStart();
  await compileImageFiles();
  compileFinish();
};
compileImage();
