const {
  compileStart,
  compileWxmlFiles,
  compileJsonFiles,
  compileImageFiles,
  removeUnusedImages,
  compileFinish,
} = require('../build');

const all = async () => {
  compileStart();
  compileJsonFiles();
  compileWxmlFiles();
  await compileImageFiles();
  removeUnusedImages(true);
  compileFinish();
};
all();
