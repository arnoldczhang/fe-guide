require('../dist/index.cjs')({
  treeshake: true,
  deleteUnused: true,
  defaultBg: true,
  tplWxss: true,
  animation: ['shine', 'jelly'],
  root: process.cwd(),
  defaultGrey: 'red',
  ignore: ['include'],
  react: {
    pageRoot: 'pages',
    page: [
      'react__page/react__page',
    ],
  },
  subPackage: [{
    root: 'sub__inner__package',
    page: [
      'sub__inner__package__page/sub__inner__package__page',
    ],
    independent: false,
  }, {
    root: 'packages',
    page: [
      'packages__page/packages__page',
    ],
    independent: false,
  }],
  page: [
    'page/page',
  ],
});
