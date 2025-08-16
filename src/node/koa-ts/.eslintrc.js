module.exports = {
  "parser": "@typescript-eslint/parser",
  "plugins": [
    'typescript',
    '@typescript-eslint'
  ],
  "extends": [
    'eslint-config-airbnb-base'
  ],
  "rules": {
    "no-param-reassign": [
      "error",
      {
        "props": false
      }
    ],
    "quotes": [
      2,
      "single",
      {
        "avoidEscape": true,
        "allowTemplateLiterals": true
      }
    ],
    "import/no-unresolved": 0,
    "no-underscore-dangle": 0,
    "global-require": 0,
    "comma-dangle": [
      "error",
      "only-multiline"
    ],
    "no-console": 0,
    "indent": ["error", 2, { "SwitchCase": 1 }],
    "class-methods-use-this": 0,
    "@typescript-eslint/explicit-function-return-type": ["error"],
    "no-useless-constructor": "off",
    "@typescript-eslint/no-useless-constructor": "error",
    "import/prefer-default-export": 0,
    "camelcase": "off"
  }
};
