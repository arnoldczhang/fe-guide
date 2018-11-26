const path = require('path');
const fs = require('fs-extra');
const { logMkk } = require('./utils');

const updateVersion = () => {
  const file = path.join(__dirname, '../', 'release/constants.js');
  const version = process.argv[2];
  if (version) {
    fs.readFile(file, 'utf8', (err, data) => {
      fs.writeFile(file, data.replace(/(VERSION\s*:\s*)(['"])[\d.]+\2/, `$1$2${version}$2`));
    });
  }
};

const myLog = () => {
  if (process.env.NODE_ENV === 'production') {
    logMkk(path.join(__dirname, '../', 'release/pages/preview/preview.js'));
  }
};

require('./build')({
  // ...
  options: {
    // ugly: false,
    // destName: '/dist',
    // quality: '45-60',
    // ...
  },
  hooks: {
    // ...
    beforeJsonCompile() {
      // ...
    },
    afterJsonCompile() {
      // ...
    },
    beforeWxmlCompile() {
      // ...
    },
    afterWxmlCompile() {
      // ...
    },
    beforeMinImage() {
      // ...
    },
    afterMinImage() {
      // ...
    },
    beforeJsCompile() {
      // ...
    },
    afterJsCompile() {
      // ...
      updateVersion();
      myLog();
    },
    beforeWxssCompile() {
      // ...
    },
    afterWxssCompile() {
      // ...
    },
    beforeRemoveUnusedImage() {
      // ...
    },
    afterRemoveUnusedImage() {
      // ...
    },
  },
});
// ...

