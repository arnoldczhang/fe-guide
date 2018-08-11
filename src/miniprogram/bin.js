const path = require('path');
const fs = require('fs-extra');

require('./build')({
  // ...
  options: {
    // quality: '45-60',
    //...
  },
  hooks: {
    // ...
    beforeJsonCompile() {
    		//...
    },
	afterJsonCompile() {
		//...
	},
	beforeWxmlCompile() {
    		//...
    },
	afterWxmlCompile() {
		//...
	},
	beforeMinImage() {
    		//...
    },
	afterMinImage() {
		//...
	},
	beforeJsCompile() {
    		//...
    },
	afterJsCompile() {
		//...
		const file = fs.readFileSync(path.join(__dirname, '../', 'release/app.js'), 'utf8');
		console.log(file);
	},
	beforeWxssCompile() {
    		//...
    },
	afterWxssCompile() {
		//...
	},
	beforeRemoveUnusedImage() {
    		//...
    },
	afterRemoveUnusedImage() {
		//...
	},
  },
});
// ...


