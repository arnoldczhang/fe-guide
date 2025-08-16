module.exports = {
  "parser": "babel-eslint",
  "extends": ["plugin:prettier/recommended", "airbnb"],
  "env": {
    "browser": true,
    "node": true,
    "amd": true,
    "commonjs": true,
    "jest": true
  },
  "plugins": [
  ],
  "rules": {
    "no-void": "off",
    "wrap-iife": "off",
    "no-nested-ternary": "off",
    "padded-blocks": "off",
    "import/no-extraneous-dependencies": "off",
    "jsx-a11y/no-noninteractive-element-interactions": "off",
    "jsx-a11y/click-events-have-key-events": "off",
    "import/extensions": "off",
    "import/first": 2,
    "no-underscore-dangle": "off",
    "arrow-body-style": "off",
    "allow-import-export-everywhere": "on",
    "linebreak-style": "off",
    "global-require": "off",
    "no-console": "off"
  },
  "parserOptions": {
    "ecmaVersion": 6,
    "sourceType": "module",
    "ecmaFeatures": {
      "jsx": true
    }
  }
};
