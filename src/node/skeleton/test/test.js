require('../dist/index.cjs')({
  treeshake: true,
  deleteUnused: true,
  defaultBg: true,
  animation: ['shine', 'jelly'],
  root: process.cwd(),
  ignore: ['include'],
  // subPackage: [{
  //   root: 'subPackage',
  //   page: [
  //     'subPackage/subPackage',
  //   ],
  // }],
  page: [
    'page/page',
  ],
});
