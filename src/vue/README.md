# vue

## 参考

- [vue3代码流程](https://mp.weixin.qq.com/s/hYYNbMUkheHVgzi26rnWPQ)
- [vue2.0开发须知](https://juejin.im/post/5d9d386fe51d45784d3f8637)
- [一份超级详细的 Vue-cli3.0 使用教程](http://obkoro1.com/web_accumulate/accumulate/tool/%E4%B8%80%E4%BB%BD%E8%B6%85%E7%BA%A7%E8%AF%A6%E7%BB%86%E7%9A%84Vue-cli3.0%E4%BD%BF%E7%94%A8%E6%95%99%E7%A8%8B.html#node%E7%89%88%E6%9C%AC%E8%A6%81%E6%B1%82%EF%BC%9A)
- [ts + vue](https://segmentfault.com/a/1190000011878086?utm_source=tag-newest)
- [编辑器-editor-codemirror](https://codemirror.net/doc/manual.html)
- [深度使用vue](https://juejin.im/post/6862560722531352583?utm_source=gold_browser_extension)
- [vue 虚拟滚动](https://github.com/Akryum/vue-virtual-scroller#variable-size-mode)
- [vue编辑器-vue-codemirror](https://github.surmon.me/vue-codemirror/)
- [vue-property-decoration](https://github.com/kaorun343/vue-property-decorator)
- [vue全资源搜索](https://bestofvue.com/)
- [vue3-后台管理系统示例1](http://admin.spicyboy.cn/#/login)
- [vue中的设计模式](https://mp.weixin.qq.com/s?__biz=Mzg3ODAyNDI0OQ==&mid=2247490496&idx=1&sn=23503fdf27e5254daab8c157e7246752&scene=21#wechat_redirect)



## 目录

<details>
<summary>展开更多</summary>

* [`极简安装&启动`](#极简安装&启动)
* [`技巧`](#技巧)
* [`vue3`](#vue3)
* [`一些尝试`](#一些尝试)
* [`组件`](#组件)
* [`修饰符`](#修饰符)
* [`vue-property-decoration`](#vue-property-decoration)
* [`坑点`](#坑点)
* [`vite`](#vite)
* [`好用的npm`](#好用的npm)

</details>

## 极简安装&启动

### 安装 vue-cli

```js
npm install -g @vue/cli // 安装cli3.x
vue --version // 查询版本是否为3.x
```

### 新建

```js
vue create hello-cli3 
```

### 零配置启动/打包

```js
npm install -g @vue/cli-service-global

vue serve App.vue // 启动服务

vue build App.vue // 打包出生产环境的包并用来部署
```

### 启动图形化界面

```js
vue ui 
```

---

## 技巧

- [vue还能这样写](https://juejin.im/post/5eef7799f265da02cd3b82fe?utm_source=gold_browser_extension)
- [vue性能优化](https://mp.weixin.qq.com/s/iQwTr5T95wPflJMT87ZObg)

### 1. slot
> vue.runtime搜索`renderSlot`

```vue
<!-- 组件 -->
<template>
  <!-- 新建了一个slot，叫header -->
  <div
    v-if="$slots.header"
    class="c-base-popup-header"
  >
    <slot name="header" />
  </div>
</template>

...

<!-- 使用 -->
<template>
  <comp>
    <!-- 用法1 -->
    <template v-slot:header>
      ...
    </template>
    <!-- 用法2 -->
    <div slot="header">多行信息<br/>第二行信息</div>
    <!-- 用法3 -->
    <!--  #代替v-slot -->
    <template #header>
      ...
    </template>
  </comp>
</template>
```

### 2. 子组件嵌套slot
```vue
<template>
  <smart-table
      ref="table"
      :config="metricConfig"
  >
    <!-- 将当前组件的slot再传递给smart-table -->
      <template
          v-for="slotName in customSlots"
          v-slot:[slotName]="rowData"
      >
          <slot
              v-bind="rowData"
              :name="slotName"
          ></slot>
      </template>
  </smart-table>
</template>
```

### 3. slot-scope
``` vue
<!-- 组件 -->
<template>
  <!-- 新建了一个slot，叫header -->
  <div
    v-if="$slots.header"
    class="c-base-popup-header"
  >
    <!-- slot用v-bind绑定插槽数据，被替换后，可以直接读取这个值 -->
    <slot v-bind="aa" />
    <slot name="value" v-bind="{ value: 123 }" />
  </div>
</template>

...

<!-- 使用 -->
<template>
  <CustomTable :data="tableData">
    <!-- 替换父组件中的默认<slot /> -->
    <template v-slot="slotProp">
      {{ slotProp.user.firstName }}
    </template>
    <!-- 替换父组件中的<slot name="value"/>，并且获取当前数据，命名为row -->
    <template v-slot:value="row">
      <!-- 由于slot绑定了{ value: 123}，所以这里可以直接操作属性value -->
      {{ row.value.toFixed(3) }}
    </template>
  </CustomTable>
</template>
```

### 4. keep-alive

> 1. vue 内置抽象组件（父子关系会跳过该组件）
>2. 根据LRU策略缓存第一个子组件实例，下次render时，根据组件 id 从缓存中拿实例（如果存在的话）
> 
>注：如果没处理好，比如之前的组件实例没销毁，将会是内存泄漏的源头

```html
<keep-alive>
  <div>...其他组件</div>
</keep-alive>
```

### 5. 优雅绑定hook

```js
{
  mounted() {
    window.addEventListener('resize', this.$_handleResizeChart)
      // 通过hook监听组件销毁钩子函数，并取消监听事件
      this.$once('hook:beforeDestroy', () => {
        window.removeEventListener('resize', this.$_handleResizeChart)
      })
  },
}
```

### 6. 覆盖外部组件scoped样式

- [几种方式](https://www.jb51.net/article/188038.htm)
- [chrome89之前对deep的支持](https://segmentfault.com/q/1010000039324714)
- vue-scoped的原理
  - 非scoped，直接走postcss --> css-loader
  - scoped，postcss需要加plugin【 @vue/component-compiler-utils/lib/stylePlugins/scoped.ts】

```vue
<style lang="less" scoped>
.aa {
  /deep/ .el-alert__title {

  }
}
</style>
```

### 7. 解耦操作组件生命周期

```vue
<template>
	<v-chart
      @hook:mounted="handleChartMounted"
      @hook:beforeUpdated="loading = true"
      @hook:updated="loading = false"
      :data="data"
  />
</template>
<script>
export default {
  data() {
    return {
      loading: false,
    };
  },
  handleChartMounted() {
    // do sth
  },
}
</script>
```

### 8. `$props`、`$attrs`和`$listeners`

```vue
<template>
	<!-- 传递父组件所有动态属性给子组件 -->
  <input v-bind="$props" />

  <!-- 传递父组件所有静态属性给子组件 -->
  <input v-bind="$attrs" />

	<!-- 将父组件 (不含 .native修饰器)的 v-on 事件监听器给子组件 -->
	<childComponent v-on="$listeners" />
</template>
```

### 9. 动态添加子组件

```vue
<template>
	<!-- 利用内置component组件，记得绑定 is 属性 -->
	<component v-for="(item,index) in componentList" :key="index" :is="item"></component>
</template>
<script>
import ColorIn from '@/components/Magic/ColorIn.vue'
import LineIn from "@/components/Magic/LineIn.vue";
import Header from "@/components/Magic/Header.vue";
import Footer from "@/components/Magic/Footer.vue";

export default{
  data() {
    return {
      componentList: ['ColorIn', 'LineIn', 'Header', 'Footer'],
    };
  },
  components:{
    ColorIn,
    LineIn,
    Header,
    Footer
  }
}
</script>
```

### 10. Vue.filter

#### 注册

```js
// 方式一：全局注册
Vue.filter('stampToYYMMDD', (value) =>{
  // 处理逻辑
});

// 方式二：全局注册多个filter
// ./common/filters/custom
const dateServer = value => value.replace(/(\d{4})(\d{2})(\d{2})/g, '$1-$2-$3')
export { dateServer }

import * as custom from './common/filters/custom'
Object.keys(custom).forEach(key => Vue.filter(key, custom[key]));

// 方式三：局部注册
export default {
 	filters: {
    stampToYYMMDD: (value)=> {
      // 处理逻辑
    }
  } 
}
```

#### 使用

```vue
<template>
	<!-- 在双花括号中 -->
	{{ message | stampToYYMMDD }}

	<!-- 在 `v-bind` 中 -->
  <div v-bind:id="rawId | dateServer"></div>
</template>
```

### 10. .sync - 子组件可修改props

#### 父组件

```vue
<template>
	<!-- 用sync定义属性 -->
	<child :foo.sync="foo" />
</template>
<script>
export default {
  data() {
    return {
      foo: 'aaa',
    };
  },
}
</script>
```

#### 子组件

```vue
<script>
//...
{
  // ...
  // 通过事件更新，类似v-model
  this.$emit('update:foo', newValue);
}
</script>
```

### 11. Object.freeze - 性能提升

```js
export default {
  data: () => ({
    users: {}
  }),
  async created() {
    const users = await axios.get("/api/users");
    this.users = Object.freeze(users);
  }
};
```

### 12. functional
```vue
<template functional>
  <div class="cell">
    <div v-if="props.value" class="on"></div>
    <section v-else class="off"></section>
  </div>
</template>
```

### 13. .native

有些组件未绑定你需要的事件（比如el-input，默认没有绑定keyup事件），则可以通过.native方式直接在元素上绑定

```vue
<template>
	<!-- 监听键盘的【下】键 -->
  <el-input
    @keyup.down.native="handlePressDown"
  ></el-input>
</template>
```

### 14. 模拟v-model

**子组件**
```vue
<template>
  <el-select v-model="model"></el-select>
</template>
<script lang="ts">
import {
  Component,
  Prop,
  Watch,
  Emit,
  Vue,
} from 'vue-property-decorator';
@Component({})
export default class Demo extends Vue {
  name = 'Demo';

  @Prop({
    type: Array,
    default: () => [],
  })
  value: any;

  get model() {
    return this.value;
  }

  set model(value: any) {
    this.$emit('input', value);
  }
}
</script>
```

**父组件**

```vue
<template>
  <Demo v-model="aa">
</template>
```

---

## vue3

### 参考

- [vue3-reactive](https://zhuanlan.zhihu.com/p/146097763)
- [vue3-compiler](https://zhuanlan.zhihu.com/p/150732926)
- [mini-vue3 by Evan You](https://codepen.io/collection/DkxpbE)
- [vue3脚手架](https://juejin.cn/post/7018344866811740173)
- [vue3学习教程](https://github.com/chengpeiquan/learning-vue3)

### compiler

#### 1. 提取动态 vnode

> vue3 有 `Block Tree` 和 `PatchFlag` 的概念
>
> `Block`相比普通VNode，多了`dynamicChildren`
>

```js
// Block仅包含最近子代的vnode
const block = {
    tag: Fragment,
    dynamicChildren: [
        {
          tag: 'p',
          children: item,
          // patchFlag用于标志静态节点还是动态节点，
          // 动态节点又分：1. 稳定动态节点 2. 不稳定动态节点
          // 稳定动态节点用优化后的算法，即提取dynamicChildren做更新
          // 不稳定动态节点还是使用之前的diff算法
          patchFlag: 1,
        }
    ],
}
```

**PatchFlag 有多种：**

- STABLE_FRAGMENT
- PROPS（还能指定 props 中的具体 key）
- CLASS
- STYLE
- TEXT
- FULL_PROPS（当props的key为动态值）
- NEED_PATCH（仅需更新ref属性）
- UNKEYED_FRAGMENT（没key的fragment）
- KEYED_FRAGMENT（有key的fragment）
- DYNAMIC_SLOTS（动态构建 `slots`时用到）

#### 2. 静态提升

> 包含 vnode 提升和 props 提升
>
> 好处是可以避免多次 diff，重复创建静态 vnode（props）

```js
// 静态vnode提升
const hoist1 = createVNode('p', null, 'text')

function render() {
    return (openBlock(), createBlock('div', null, [
        hoist1
    ]))
}

// 静态props提升
const hoistProp = { foo: 'bar', a: 'b' }

render(ctx) {
    return (openBlock(), createBlock('div', null, [
        createVNode('p', hoistProp, ctx.text)
    ]))
}
```

**哪些情况不会被静态提升？**

- 元素带有动态的 key 绑定（key 不同即使别的属性相同，做的也是完全替换，用不到 diff）
- 使用 ref 的元素（创建新元素当然要更新 ref，总不能指向老元素吧）
- 使用自定义指令的元素
- 动态属性，且非常量（也就是说仅包含常量的动态属性也会被静态提升）

#### 3. 预字符串化
> 大量连续的类似的vnode，与其做静态提升，不如预字符串化。
>
> 相对于静态提升：
> 1. 节省内存
> 2. 减少代码
>

**示例**

```html
<div>
    <p></p>
    <p></p>
    ...20 个 p 标签
    <p></p>
</div>
```

如果用静态提升
```js
const hoist1 = createVNode('p', null, 'text')
const hoist2 = createVNode('p', null, 'text')
// ...
const hoist20 = createVNode('p', null, 'text')
```
如果用预字符串化
```js
const hoistStatic = createStaticVNode('<p></p>...20个');
```

**哪些不会预字符串化？**

- 格类标签：caption 、thead、tr、th、tbody、td、tfoot、colgroup、col
- 含非标准[html属性](https://developer.mozilla.org/en-US/docs/Web/HTML/Attributes)，不包括aria-
- 连续静态节点（含子节点）少于20个
- 连续含属性的静态节点（含子节点）少于5个

#### 4. Cache Event handler
> 绑定的事件做缓存处理

**示例**

```html
<Comp @change="a + b" />
```
默认编译为
```js
render(ctx) {
    return h(Comp, {
        onChange: () => (ctx.a + ctx.b)
    })
}
```
开启`prefixIdentifiers`和`cacheHandlers`后
```js
render(ctx, cache) {
    return h(Comp, {
        onChange: cache[0] || (cache[0] = ($event) => ctx.a + ctx.b)
    })
}
```

### composition

@vue/composition-api

### 一些用法

```typescript
import { ComputedRef, InjectionKey } from 'vue';


// 封装既有el-input
import { useVModel } from '@vueuse/core';

const emit = defineEmits<{
  (e: 'update:modelValue', value: string): void;
}>();
const _modelValue = useVModel(props, 'modelValue', emit);


// 入参情况
import { MaybeRef } from '@vueuse/core';
const fn = (list: MaybeRef<Record<string, any>[]>) => {};


```




---

## 一些尝试

- [懒加载通用组件](./datapanel/README.md)
- [美化后的 tree 结构组件](./vue-pretty-tree/README.md)

---

## 组件

### vue3-smooth-dnd

> 基于smooth-dnd的vue3拖拽库



### vue-code-diff
> 类git风格代码对比，[参考](https://www.npmjs.com/package/vue-code-diff)

#### 使用到的库
```js
<div v-html="html" v-highlight></div>

// ..
import { createPatch } from 'diff';
import { Diff2Html } from 'diff2html';
import hljs from 'highlight.js';
import 'highlight.js/styles/googlecode.css';
import 'diff2html/dist/diff2html.css';

{
  // ...
  computed: {
    html() {
      const oldString = 'hello world';
      const newString = 'hello world2';
      const args = ['', oldString, newString, '', ''];
      // 这里获取了git diff 的结果
      const dd = createPatch(...args);
      // git diff 结果转 json
      const outStr = Diff2Html.getJsonFromDiff(dd, {
        inputFormat: 'diff',
        outputFormat: 'side-by-side',
        showFiles: false,
        matching: 'lines',
      });
      // json 转 html
      const html = Diff2Html.getPrettyHtml(outStr, {
        inputFormat: 'json',
        outputFormat: 'side-by-side',
        showFiles: false,
        matching: 'lines',
      });
      return html;
    },
  },
  // ...
}
```

### tiptap
> 轻量级页面编辑器

```vue
<template>
  <div>
    <editor-menu-bar :editor="editor" v-slot="{ commands, isActive }">
        <button :class="{ 'is-active': isActive.bold() }" @click="commands.bold">
          Bold
        </button>
    </editor-menu-bar>
    <editor-content :editor="editor" />
  </div>
</template>

<script>
import { Editor, EditorContent, EditorMenuBar } from 'tiptap'
import {
  Blockquote,
  CodeBlock,
  HardBreak,
  Heading,
} from 'tiptap-extensions'

export default {
  components: {
    EditorMenuBar,
    EditorContent,
  },
  data() {
    return {
      editor: new Editor({
        extensions: [
          new Blockquote(),
          new CodeBlock(),
          new HardBreak(),
          new Heading({ levels: [1, 2, 3] }),
          // ...按需注入扩展
        ],
        content: `
          <h1>Yay Headlines!</h1>
          <p>All these <strong>cool tags</strong> are working now.</p>
        `,
      }),
    }
  },
  beforeDestroy() {
    this.editor.destroy()
  },
}
</script>
```

---

## 坑点

### [this.getOptions is not a function](https://stackoverflow.com/questions/66082397/typeerror-this-getoptions-is-not-a-function)

```json
{
	"sass-loader": "^10",
}
```



### Error: PostCSS received undefined instead of CSS string

```sh
yarn add node-sass@4.14.1
```

---

## 修饰符

[参考](https://juejin.cn/post/6981628129089421326?utm_source=gold_browser_extension#heading-1)

### lazy

> blur后才触发值更新

```vue
<input type="text" v-model.lazy="value">
<div>{{value}}</div>

data() {
        return {
            value: '222'
        }
    }

```

### trim

### number

### left,middle,right

### keycode

---

## vue-property-decoration

### Provider/Inject

注：provide的对象，未实现响应式（即变动无法更新inject的地方）

Parent.vue

```vue
// Parent.vue
<template>
  <div>The parents value: {{this.providedValue}}</div>
  <child />
</template>

<script lang="ts">
  import { Component, Vue, Provide} from 'vue-property-decorator';
  import Child from './Child.vue';

  @Component({components: Child})
  export default class Parent extends Vue {
    @Provide('key') private providedValue: string = 'The value';
  }
</script>
```

Child.vue

```vue
// Child.vue
<template>
  <div>The childs value: {{this.injectedValue}}</div>
</template>

<script lang="ts">
import { Component, Vue, Inject } from 'vue-property-decorator';

@Component
export default class Child extends Vue {
  @Inject('key') private injectedValue!: string;
}
</script>
```



---



## vite

- [webpack-to-vite](https://github.com/originjs/webpack-to-vite)
- [vite实践](https://mp.weixin.qq.com/s/pUzUr1lTfX3wkzJL_Xv1oQ)
- [webpack和vite在开发阶段的区别](https://mp.weixin.qq.com/s?__biz=Mzg2MDU4MzU3Nw==&mid=2247492637&idx=1&sn=3b2403d0c66f1e5cdd5226fb5f06afd3&scene=21#wechat_redirect)

---

## 好用的npm

点击外部：v-click-outside