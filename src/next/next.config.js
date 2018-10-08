const withLess = require('@zeit/next-less');
const withCSS = require('@zeit/next-css');
const withTypescript = require('@zeit/next-typescript');
const withImages = require('next-images');

module.exports = withTypescript({
  ...withLess({
    cssModules: true,
    cssLoaderOptions: {
      importLoaders: 1,
      localIdentName: "[local]___[hash:base64:5]",
    },
    lessLoaderOptions: {
      javascriptEnabled: true,
    },
    ...withCSS({
      ...withImages(),
    }),
  }),
});
