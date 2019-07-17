# skeleton

## 步骤
- [x]复制页面文件 + 引用的模板 + 引用的自定义组件
  * [x]**page**: src/pages -> src/skeleton/pages
  * [x]**template**: src/components -> src/skeleton/components
  * [x]递归解析页面文件嵌套
  * [x]**自定义组件**: src/components -> src/skeleton/components
- [x]页面文件转自定义组件
- [x]wxss引用原文件 + skeleton库文件
  * [x]**page**: @import ../../src/pages/page/page.wxss
  * [x]**template**: @import ../../src/components/component/components.wxss
  * [x]**自定义组件**: @import ../../src/components/component/components.wxss
  * [x]自定义组件不能包含部分样式选择器，否则会导致wxss被忽略
  * [x]建立skeleton库文件
- []模板解析
  * [x]无关内容移除
  * [x]占位块替换
  * []路标语法
    + skull-remove
    + skull-repeat
      TODO repeat次数可通过外部输入
    + skull-show
    + skull-bg
- [x]定义配置文件
- [x]node_modules
- []自定义组件properties绑定
- []wxss做treeshake
- []template的wxss做treeshake
- [x]id选择器转class
- [x]include标签处理
- [x]可配置骨架图生成页面
- []样式库完善&动态化样式
- []子包页面文件处理
- []页面wxml静态编译
- [x]骨架图文件再编译不该重复打包
- []监听源文件改动
- []自定义组件js复用
