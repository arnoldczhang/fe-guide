module.exports = {
  treeshake: true,
  animation: 'shine',
  inputDir: './src',
  outDir: './src',
  ignore: ['include'],
  subPackage: [{
    root: 'root',
    page: [
      'subpage/subpage',
    ],
  }],
  page: [
    'page/page',
  ],
};
