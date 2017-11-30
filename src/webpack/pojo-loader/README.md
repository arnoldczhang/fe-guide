[![npm][npm]][npm-url]
[![node][node]][node-url]
[![deps][deps]][deps-url]
[![tests][tests]][tests-url]
[![coverage][cover]][cover-url]
[![chat][chat]][chat-url]

<div align="center">
  <img width="160" height="180"
    src="https://worldvectorlogo.com/logos/json.svg">
  <a href="https://github.com/webpack/webpack">
    <img width="200" height="200"
      src="https://webpack.js.org/assets/icon-square-big.svg">
  </a>
  <h1>pojo Loader</h1>
</div>

<h2 align="center">Install</h2>

```bash
npm install --save-dev pojo-loader
```

> ⚠️ **Since `webpack >= v2.0.0`, importing of JSON files will work by default. You might still want to use this if you use a custom file extension. See the [v1.0.0 -> v2.0.0 Migration Guide](https://webpack.js.org/guides/migrating/#json-loader-is-not-required-anymore) for more information**

<h2 align="center">Usage</h2>

### `Inline`

```js
pojo aa.pojo aa.js
```

### `Configuration` (recommended)

```js
const pojo = require('./file.pojo');
```

**webpack.config.js**
```js
module.exports = {
  module: {
    rules: [
      {
        test: /\.pojo$/,
        loader: 'pojo-loader'
      }
    ]
  }
}
```


[npm]: https://img.shields.io/npm/v/pojo-loader.svg
[npm-url]: https://npmjs.com/package/pojo-loader

[node]: https://img.shields.io/node/v/pojo-loader.svg
[node-url]: https://nodejs.org

[deps]: https://david-dm.org/webpack/pojo-loader.svg
[deps-url]: https://david-dm.org/webpack/pojo-loader

[tests]: http://img.shields.io/travis/webpack/pojo-loader.svg
[tests-url]: https://travis-ci.org/webpack/pojo-loader

[cover]: https://coveralls.io/repos/github/webpack/pojo-loader/badge.svg
[cover-url]: https://coveralls.io/github/webpack/pojo-loader

[chat]: https://badges.gitter.im/webpack/webpack.svg
[chat-url]: https://gitter.im/webpack/webpack
