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
  * []建立skeleton库文件
- []模板解析
  * [x]无关内容移除
  * []占位块替换
  * [x]路标语法
    + skull-remove
    + skull-repeat
      TODO repeat次数可通过外部输入
    + skull-show
    + skull-bg
- []定义配置文件
- []node_modules