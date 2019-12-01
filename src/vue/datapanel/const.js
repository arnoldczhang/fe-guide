import { noop, genRand } from './utils';

const { keys } = Object;

export const PRE = 'dPanel';

export const PRE_ING = genRand(PRE);

export const PRE_CONN = 'd-panel';

export const OPTIONS = {
  // 指定子组件接受外部数据的字段名
  KEY: 'key',
  // 指定子组件内部请求接口的方法名（该方法也要支持无入参情况的调用）
  FETCHKEY: 'fetchKey',
  // 指定自增配置（字段映射和时间间隔）
  INCREMENT: 'increment',
};

export const METHODS = {
  // 子组件请求接口的方法重写，新增激活校验
  REWRITEFETCHFN: `${PRE_ING}rewriteFetchFn`,
  // 绑定 intersection 监听
  WATCH: `${PRE_ING}watch`,
  // 解绑 intersection 监听
  UNWATCH: `${PRE_ING}unwatch`,
  // 继承激活校验
  ISACTIVE: `${PRE_ING}isActive`,
  // 重置接口请求态
  RESET: `${PRE_ING}reset`,
  // 计算自增字段
  CALCINCREMENTKEY: `${PRE_ING}calcIncrementKey`,
  // 处理接口入参
  PARSEREQPARAM: `${PRE_ING}parseReqParam`,
  // 接口请求前预处理
  CHECKRELOAD: `${PRE_ING}checkReload`,
  // 请求接口
  DOREQUEST: `${PRE_ING}doRequest`,
};

export const DATA = {
  LASTREQPARAM: `${PRE_ING}lastReqParam`,
  RELOADTIME: `${PRE_ING}reloadTime`,
  RELOADING: `${PRE_ING}reloading`,
  ONCE: `${PRE_ING}once`,
  BASEINSTANCE: `${PRE_ING}baseInstance`,
};

export const PROPS = {
  RETRY: `${PRE}Retry`,
  REFRESH: `${PRE}Refresh`,
  REQUEST: `${PRE}Request`,
  PARSE: `${PRE}Parse`,
  REQUESTCALLBACK: `${PRE}RequestCallback`,
  REQUESTPARAM: `${PRE}RequestParam`,
  BEFOREDATAUPDATE: `${PRE}BeforeDataUpdate`,
  DATACOMBINE: `${PRE}DataCombine`,
  DEFAULT: `${PRE}Default`,
};

export const PROPS_STATE = [PROPS.REFRESH, PROPS.RETRY];

export const PANEL_EVENT = {
  // 请求异常事件
  ERROR: `${PRE_CONN}-error`,
  // 请求中事件
  LOADING: `${PRE_CONN}-loading`,
};

export const dataPanelProps = {
  // 强制请求接口，用于异常重试场景
  [PROPS.RETRY]: {
    type: [String, Function],
    default: null,
  },
  // 强制请求接口（用真实 props 入参），用于折线图等增量加载场景
  [PROPS.REFRESH]: {
    type: [String, Function],
    default: null,
  },
  // 子组件兜底值
  [PROPS.DEFAULT]: {
    default: null,
  },
  // 请求接口入参
  [PROPS.REQUESTPARAM]: {
    type: Object,
    default: () => ({}),
  },
  // 请求接口方法
  [PROPS.REQUEST]: {
    type: Function,
    default: noop,
  },
  // 接口响应值预处理方法
  [PROPS.PARSE]: {
    type: Function,
    default: noop,
  },
  // 原数据被接口响应值更新前
  [PROPS.BEFOREDATAUPDATE]: {
    type: Function,
    default: noop,
  },
  // 增量请求后，前后数据的融合方法
  [PROPS.DATACOMBINE]: {
    type: Function,
    default: noop,
  },
  // 原数据被接口响应值更新后的结果回调
  [PROPS.REQUESTCALLBACK]: {
    type: Function,
    default: noop,
  },
};

export const dataPanelPropsKey = keys(dataPanelProps || {});

export const TIME = {
  w: 1000 * 60 * 60 * 24 * 7,
  d: 1000 * 60 * 60 * 24,
  H: 1000 * 60 * 60,
  M: 1000 * 60,
  S: 1000,
};
