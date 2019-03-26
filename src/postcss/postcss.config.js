module.exports = {
  // switch syntax automatically by file extensions
  parser: 'postcss-syntax',
  plugins: [
    require('postcss-markdown'),
    require('autoprefixer'),
    require('cssnano'),
  ]
}