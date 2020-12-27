const rules = {
    indent: ['error', 2],
    'no-trailing-spaces': 2,
    'vue/require-component-is': 'off', // There is a bug, it always reports an error. See https://github.com/vuejs/eslint-plugin-vue/issues/869
    // 有效v-for指令
    'vue/valid-v-for': 0,
    // v-for 须指定 key
    'vue/require-v-for-key': 0,
    'no-console': [1, { allow: ['warn', 'error'] }],
    'no-debugger': 1,
    'comma-dangle': [1, 'only-multiline'],
    'no-undefined': 0,
    'no-redeclare': 0,
    // 单引号
    quotes: [1, 'single'],
    'quote-props':['error', 'as-needed'],
    'consistent-return': 0,
    // @typescript-eslint 规则重复
    '@typescript-eslint/indent': ['error', 2],
    'no-extra-semi': 0,
    semi: 0,
    // 'semi': [2, 'always'],
    // ts 规则
    '@typescript-eslint/explicit-member-accessibility': [1, {
      accessibility: 'no-public'
    }],
    '@typescript-eslint/explicit-function-return-type': 0,
    '@typescript-eslint/interface-name-prefix': 0,
    '@typescript-eslint/semi': ['error'],
    '@typescript-eslint/camelcase': [0, {
      allow: ['^\\$_']
    }],
    '@typescript-eslint/explicit-module-boundary-types': 0,
    'no-extra-parens': 'off',
    '@typescript-eslint/no-extra-parens': 2,
  
    'no-non-null-assertion': 0,
    '@typescript-eslint/no-non-null-assertion': 0,
    '@typescript-eslint/no-explicit-any': 0,
    'vue/valid-v-slot':0
  };
  
  if (process.env.NODE_ENV === 'production') {
    Object.assign(rules, {
      'no-debugger': 2,
    });
  }
  
  module.exports = {
    root: true,
    extends: [
      '@vue/typescript',
      'plugin:@typescript-eslint/eslint-recommended',
      'prettier/@typescript-eslint',
      'plugin:@typescript-eslint/recommended',
    ],
    parser: 'vue-eslint-parser',
    parserOptions: {
      parser: '@typescript-eslint/parser',
      ecmaFeatures: {
        legacyDecorators: true,
        ecmaVersion: 2019,
        sourceType: 'module'
      },
      useJSXTextNode: true,
      extraFileExtensions: ['.vue']
    },
    plugins: [
      'vue',
      '@typescript-eslint'
    ],
    rules,
    globals: {}
  };
  
  