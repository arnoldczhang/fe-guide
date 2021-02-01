# VuePress

## 用法

### 自定义webpack配置
```js
// config.js
module.exports = {
  // 任何插件
  plugins: [
    'element-ui',
  ],
  themeConfig: {
    // 头部导航配置
    nav: [
      // { text: '指南', link: '/install/' },
      // { text: '案例', link: '/example/' },
      // { 
      //     text: '案例', 
      //     link: '/example/',
      //     items: [
      //         {text: 'nav1', link: '/example/nav1/'},
      //          {text: 'nav1', link: '/example/nav1/'}
      //     ]
      // },
  ],
  // 左边栏配置
  sidebar: createSidebar(),
  // webpack配置
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
