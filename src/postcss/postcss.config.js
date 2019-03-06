module.exports = {
  parser: 'postcss-syntax',
  plugins: [
    require('postcss-markdown'),
    require('autoprefixer'),
    require('cssnano'),
  ]
}