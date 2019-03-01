module.exports = {
  parser: 'postcss-less',
  plugins: [
    require('postcss-less-engine'),
    require('cssnano'),
    require('autoprefixer'),
  ]
}