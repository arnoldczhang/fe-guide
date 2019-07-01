# skeleton

## 步骤
- [x]复制页面文件 + 引用的模板 + 引用的自定义组件
  * [x]**page**: src/pages -> src/skeleton/pages
  * [x]**template**: src/components -> src/skeleton/components
  * [x]递归解析页面文件嵌套
  * []**自定义组件**: src/components -> src/skeleton/components
- [x]页面文件转自定义组件
- [x]wxss引用原文件 + skeleton库文件
  * [x]**page**: @import ../../src/pages/page/page.wxss
  * [x]**template**: @import ../../src/components/component/components.wxss
  * []**自定义组件**: @import ../../src/components/component/components.wxss
  * []建立skeleton库文件
- []模板解析
  * []无关内容移除
  * []占位块替换
- []定义配置文件
- []node_modules