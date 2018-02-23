const page = require('webpage').create();
const system = require('system');
let t, address;

if (system.args.length === 1) {
  console.log('Usage: loadspeed.js <some URL>');
  phantom.exit();
}

t = Date.now();
address = system.args[1];
page.settings.userAgent = 'micromessenger';
page.open(address, function(status) {
  if (status !== 'success') {
    console.log('FAIL to load the address');
  } else {
    t = Date.now() - t;
    console.log('Loading ' + system.args[1]);
    console.log('Loading time ' + t + ' msec');
    const content = page.evaluate(function() {
      return document.body.textContent;
    });
    console.log(content);
  }
  phantom.exit();
});