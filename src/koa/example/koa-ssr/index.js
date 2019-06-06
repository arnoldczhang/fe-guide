const path = require('path');
const rootPath = path.join(__dirname, '.');

require("@babel/register")({
  babelrc: false,
  presets: [
    '@babel/preset-env',
    [
      "@babel/preset-react",
      {
        // "pragma": "dom", // default pragma is React.createElement
        "pragmaFrag": "DomFrag", // default is React.Fragment
        "throwIfNamespace": false // defaults to true
      }
    ],
  ],
  ignore: [
    /node_modules/,
  ],

  only: [
    rootPath
  ],
  extensions: [".es6", ".es", ".jsx", ".js", ".mjs"],
  cache: true,
});
require("./src/server");
