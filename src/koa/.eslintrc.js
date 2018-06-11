// http://eslint.org/docs/user-guide/configuring

module.exports = {
  root: true,
  parser: 'babel-eslint',
  parserOptions: {
    sourceType: 'module'
  },
  env: {
    browser: true,
  },
  extends: 'airbnb-base',
  // required to lint *.vue files
  plugins: [
    'html'
  ],
  // check if imports actually resolve
  'settings': {
    'import/resolver': {
      'webpack': {
        'config': 'webpack.config.js'
      }
    }
  },
  // add your custom rules here
  'rules': {
    // don't require .vue extension when importing
    'no-param-reassign': ['off', 'always', {
      'js': 'never',
      'vue': 'never'
    }],
    'import/extensions': ['off', 'always', {
      'js': 'never',
      'vue': 'never'
    }],
    'linebreak-style': ['off', 'awlays'],
    'object-shorthand': ['off', 'awlays'],
    // allow debugger during development
    'no-debugger': process.env.NODE_ENV === 'production' ? 2 : 0
  }
}
