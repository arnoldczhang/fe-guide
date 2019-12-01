# dataPanel

## 目录
* [`描述`](#描述)
* [`特性`](#特性)
* [`过程`](#过程)
* [`包装属性`](#包装属性)
* [`props`](#props)
* [`事件`](#事件)
* [`用法`](#用法)
* [`问题`](#问题)

## 描述
> 一个高阶组件，继承于原组件，并扩展了原型方法


## 特性
> 1. 代理原组件的 数据请求-赋值 过程，并做了请求节流、防抖，懒加载
> 2. 支持折线图等增量加载
> 3. 理论上，兼容所有图表、表单等数据视图
> 4. 继承原组件methods、props、data，命名已做防冲突
> 5. 仍然保持原组件的用法

## 过程
1. 全局注册事件监听（IntersectionObserver、focus/blur）
2. 包装原组件
3. 开始使用

## 包装属性
> 包装原组件时，可预设配置项如下：

| 属性 | 类型 | 作用 | 必要性 |
| -------- | -----: | :----: | :----: |
| key | String | 原组件接收数据对应的 key 名称 | 必选 |
| increment | Object | 增量配置，可见下方[举例](./用法) | 可选 |
| fetchKey | String | 原组件自请求的方法名，可见下方[举例](./用法) | 可选 |

## props
> 使用 dataPanel 组件时，可传如下 props:

| 属性 | 类型 | 作用 | 必要性 |
| -------- | -----: | :----: | :----: |
| d-panel-retry | Function或String | 请求异常重试方法或方法名（需要在父组件注册这个空方法，为了回避 vue 的未注册警告），入参取上次请求的入参 | 可选 |
| d-panel-refresh | Function或String | 重新请求方法或方法名（需要在父组件注册这个空方法，为了回避 vue 的未注册警告），入参取外部传入的入参 | 可选 |
| d-panel-request | Function<requestParam: Object> | 请求方法 | 可选 |
| d-panel-requestParam | Object | 请求入参 | 可选 |
| d-panel-parse | Function<response: Object> | 请求返回值预处理 | 可选 |
| d-panel-beforeDataUpdate | Function<oldData: Object, parsedData: Object> | 原数据更新前处理 | 可选 |
| d-panel-dataCombine | Function<oldData: Object, parsedData: Object> | 原数据和请求返回值合并的处理 | 可选 |
| d-panel-requestCallback | Function<newData: Object> | 数据更新后的回调 | 可选 |
| d-panel-default | any | 原组件默认值 | 可选 |

## 事件
| 属性 | 类型 | 作用 | 必要性 |
| -------- | -----: | :----: | :----: |
| d-panel-loading | Function<Boolean> | 请求中 | 可选 |
| d-panel-error | Function<Boolean> | 请求异常 | 可选 |

## 用法

**1. 全局注册事件监听**

```js
import { IntersectionObserverHelper } from 'src/components/dataPanel';
//...
IntersectionObserverHelper.init();

// ...
new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App)
});
```

**2. 包装原组件**

```js
// 普通组件包装方式
import Wrapper from 'src/components/dataPanel';
import Echart from './index.vue';

export default Wrapper(Echart, {
  key: 'option',
});
```

```js
// 自请求组件包装方式
import Wrapper from 'src/components/dataPanel';
import TableContainer from './index.vue';

export default Wrapper(TableContainer, {
  key: 'tableData',
  fetchKey: '_loadData',
});
```

```js
// 自增组件包装方式
import Wrapper from 'src/components/dataPanel';
import LineChart from './index.vue';

export default Wrapper(LineChart, {
  key: 'option',
  increment: {
    beginDate: {
      key: 'endDate',
      step: '-5M',
    },
    beginDate2: {
      key: 'endDate2',
      step: '-5M',
    },
  },
});

// 根据需要，可以创建任意个包装组件
export const DurationLineChart = Wrapper(LineChart, {
  key: 'option',
  increment: {
    beginDate: {
      key: 'endDate',
      step: '-5M',
    },
  },
});
```

**3. 开始使用**

```js
import { DurationLineChart } from 'src/components/lineBarWithKeyNode/index.js';
import TableContainer from 'src/components/tableContainer/index.js';

<template>
  <line-chart
    :d-panel-request="requestTrend"
    :d-panel-parse="parseTrend"
    :d-panel-data-combine="updateTrendData"
    :d-panel-request-param="getReqParams()"
    :d-panel-retry="handleTrendRetry"
    @d-panel-loading="handleTrendLoading"
    @d-panel-error="handleTrendError"
    width="100%"
    height="300px"
  />

  <!-- 仍然当原组件使用 -->
  <table-container
    :auto-load="false"
    :remote-method="fetchErrorUV"
    :category-meta="userUVCategoryMeta"
  />

  <table-container
    :category-meta="categoryMeta"
    :d-panel-request="requestTable"
    :d-panel-parse="parseTable"
    :d-panel-request-callback="useTableData"
    :d-panel-request-param="getReqParams()"
    :d-panel-retry="handleTableRetry"
    @d-panel-loading="handleTableLoading"
    @d-panel-error="handleTableError"
  />
</template>

// 同 vue 组件用法
{
  // ...
  components: {
    'line-chart': DurationLineChart,
    'table-container': TableContainer,
  },
  // ...
}
// ...
```

## 已替换组件
- echarts
- lineBarWithKeyNode
- tableContainer
- multipleForm
- pie-list
- loading-chart

## 问题

**页面**: errorTracking/analysis

**描述**: tableContainer 支持传 `remoteMethod` 作为入参

**影响**: 请求完全由组件内部控制了，无法用 dataPanel 做节流

**状态**: DONE



