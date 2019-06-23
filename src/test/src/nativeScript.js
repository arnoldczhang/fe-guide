const vm = require('vm');
const path = require('path');
const fs = require('fs');
const NativeModule = require('module');

const code = fs.readFileSync(path.join(__dirname, './server.js'), 'utf-8');
const wrapper = NativeModule.wrap(code);
const m = { exports: {} };
const r = file => {
  return require(file);
};
const script = new vm.Script(wrapper, {
  filename: 'server.js',
  displayErrors: true,
});

script.runInNewContext().call(m.exports, m.exports, r, m);

m.exports();