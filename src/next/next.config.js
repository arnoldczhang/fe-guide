const withLess = require('@zeit/next-less');
const withTypescript = require('@zeit/next-typescript');
const withImages = require('next-images');

module.exports = withTypescript({
  ...withLess({
    cssModules: true,
    cssLoaderOptions: {
      importLoaders: 1,
      localIdentName: "[local]___[hash:base64:5]",
    },
    ...withImages(),
  }),
});
