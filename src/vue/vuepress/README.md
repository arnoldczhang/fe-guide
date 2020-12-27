# VuePress

## 用法

### 自定义webpack配置
```js
module.exports = {
  configureWebpack(config) {
    console.log(config.module);
    config.resolve.alias['@'] = alias;
    config.resolve.extensions = ['.js', '.ts', '.tsx', '.vue', '.json', '.scss'];
    config.module.rules.push({
        test: /\.tsx?$/,
        loaders: [
            {
                loader: 'ts-loader',
                options: {
                    appendTsSuffixTo: [/\.vue$/]
                }
            }
        ]
    });
  },
};
```
