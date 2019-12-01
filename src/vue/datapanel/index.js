import dateformat from 'dateformat';
import {
  noop,
  genRand,
  filterKeys,
  shallowVueEq,
  toConn,
} from './utils';
import {
  IntersectionObserverHelper as IOH,
  getPropWatchers,
  updateContextMethods,
} from './helpers';
import {
  dataPanelProps,
  dataPanelPropsKey,
  PANEL_EVENT,
  TIME,
  METHODS,
  DATA,
  PROPS,
  PROPS_STATE,
  OPTIONS,
} from './const';

const {
  keys,
} = Object;
const {
  REWRITEFETCHFN,
  WATCH,
  UNWATCH,
  ISACTIVE,
  RESET,
  CALCINCREMENTKEY,
  PARSEREQPARAM,
  CHECKRELOAD,
  DOREQUEST,
} = METHODS;

const {
  LASTREQPARAM,
  RELOADTIME,
  RELOADING,
  ONCE,
  BASEINSTANCE,
} = DATA;

const {
  REQUESTPARAM,
  REQUEST,
  PARSE,
  BEFOREDATAUPDATE,
  REQUESTCALLBACK,
  DATACOMBINE,
  DEFAULT,
} = PROPS;

const {
  KEY,
  FETCHKEY,
  INCREMENT,
} = OPTIONS;

/**
 * dataPanel
 *
 * 基础行为组件
 *
 * 1. 支持所有数据区块（折线图、表格、饼图等）
 * 2. 支持增量加载
 * 3. 懒加载（视窗内、浏览器 tab 呈激活状态、元素可见）
 *
 * @param {Component} Base
 */
export default function DataPanel(BaseComp, options = {}) {
  let incrementKey;
  const Base = typeof BaseComp === 'function'
    ? (BaseComp.sealedOptions || BaseComp.options)
    : BaseComp;
  const {
    methods: baseMethods,
    props: baseProps,
  } = Base;
  const baseMethodsKey = keys(baseMethods || {});
  const {
    [KEY]: key,
    [FETCHKEY]: fetchKey,
    [INCREMENT]: increment,
  } = options;

  if (!key) {
    throw new Error('必须提供 key 给 dataPanel');
  }

  if (increment) {
    incrementKey = keys(increment);
    if (!incrementKey.every(increKey => increment[increKey].key)) {
      throw new Error('增量配置必须含  key');
    }
  }

  // dataPanel 内的请求数据 key
  const panelKey = genRand(key);

  // 提取内部绑定的 props-key
  const {
    [key]: shadowKey,
    ...otherBaseProps
  } = baseProps;
  const {
    watch,
    unwatch,
    isActive,
  } = IOH;

  return {
    beforeDestroy() {
      this[UNWATCH](this.$el);
    },
    created() {
    },
    mounted() {
      const [baseInstance] = this.$children;
      this[BASEINSTANCE] = baseInstance;
      this[WATCH](this, this[CHECKRELOAD]);
      this[REWRITEFETCHFN]();
    },
    watch: {
      ...getPropWatchers(),
    },
    computed: {
      [key]() {
        // 允许子组件仍然走自己的请求流程
        return this[panelKey] || this.$attrs[toConn(key)];
      },
    },
    data() {
      const {
        [DEFAULT]: defaultValue,
      } = this;
      return {
        // 记录接口返回值
        [panelKey]: defaultValue || null,
        // 上次接口入参
        [LASTREQPARAM]: null,
        // 请求间隔
        [RELOADTIME]: 2000,
        // 请求态
        [RELOADING]: false,
        // 首次成功请求标志
        [ONCE]: true,
        // 子组件实例
        [BASEINSTANCE]: null,
      };
    },
    methods: {
      // 重定向子组件 methods
      ...baseMethodsKey.reduce((res, k) => {
        res[k] = function proxyBaseMethod(...args) {
          baseMethods[k].apply(this[BASEINSTANCE], args);
        };
        return res;
      }, {}),
      [WATCH]: watch,
      [UNWATCH]: unwatch,
      [ISACTIVE]: isActive,
      [RESET]() {
        this[RELOADING] = true;
        setTimeout(() => {
          this[RELOADING] = false;
        }, this[RELOADTIME]);
      },
      [CALCINCREMENTKEY]({
        key: increKey,
        type = Date,
        step = '-1M',
      }) {
        let result;
        let temp;
        let gap = 0;
        const {
          [LASTREQPARAM]: lastReqParam,
        } = this;
        const lastValue = lastReqParam[increKey];

        switch (type) {
          // TODO 暂时只考虑 Date 的情况
          case Date:
          default:
            temp = new Date(lastValue).getTime();
            step.replace(/(\d*)(M|S)/g, (m, $1, $2) => {
              const stepValue = $1 * TIME[$2] || $1;
              gap += stepValue;
              return m;
            });
            temp += +`${step[0] === '-' ? '-' : '+'}${gap}`;
            result = temp;
        }
        return dateformat(result, 'yyyy-mm-dd HH:MM:ss');
      },
      [PARSEREQPARAM]() {
        const {
          [REQUESTPARAM]: requestParam,
          [LASTREQPARAM]: lastReqParam,
        } = this;
        // 首次请求失败的情况，仍用原参数请求
        if (!lastReqParam) {
          return requestParam;
        }

        const result = {};
        incrementKey.forEach((k) => {
          result[k] = this[CALCINCREMENTKEY](increment[k]);
        });

        return {
          ...requestParam,
          ...result,
        };
      },
      [REWRITEFETCHFN]() {
        if (fetchKey) {
          const isActiveFn = this[ISACTIVE];
          const oldFetchFn = this[BASEINSTANCE][fetchKey];
          if (typeof oldFetchFn !== 'function') {
            throw new Error('未找到 fetchKey 对应的方法');
          }
          this[BASEINSTANCE][fetchKey] = function proxyFetchFn(...args) {
            if (isActiveFn()) {
              oldFetchFn.apply(this, ...args);
            }
          };
        }
      },
      [CHECKRELOAD](force = !increment, propKey = '') {
        const {
          [REQUEST]: panelRequest = noop,
          [PARSEREQPARAM]: parseReqParam = noop,
          [REQUESTPARAM]: panelRequestParam,
          [ONCE]: once,
          [RELOADING]: reloading,
          [LASTREQPARAM]: lastReqParam,
        } = this;

        // 如果不指定请求方法，走子组件自身的请求逻辑
        if (panelRequest === noop) {
          if (!fetchKey) {
            return;
          }

          if (once) {
            try {
              // TODO 首次调用子组件请求方法，入参怎么确定？
              this[BASEINSTANCE][fetchKey]();
              this[ONCE] = false;
            } catch (err) {
              throw new Error(err);
            }
          }
          return;
        }

        // 非激活态或加载中，不请求
        if (!this[ISACTIVE]() || reloading) {
          return;
        }

        this[RESET]();

        let reqParam;
        const forceRefresh = force || !increment || once;
        if (forceRefresh) {
          reqParam = panelRequestParam;
          this[ONCE] = false;
        } else {
          reqParam = parseReqParam();
        }

        // 非状态变更的 props 变化触发时，前后接口入参一致，不请求
        if (!PROPS_STATE.includes(propKey)) {
          if (shallowVueEq(lastReqParam, reqParam)) {
            return;
          }
        }

        this[DOREQUEST](reqParam, forceRefresh);
      },
      [DOREQUEST](reqParam, force) {
        const {
          [REQUEST]: panelRequest = noop,
          [PARSE]: panelParse = noop,
          [BEFOREDATAUPDATE]: panelBeforeDataUpdate = noop,
          [DATACOMBINE]: panelDataCombine = noop,
          [REQUESTCALLBACK]: panelRequestCallback = noop,
        } = this;
        this.$emit(PANEL_EVENT.LOADING, true);
        this.$emit(PANEL_EVENT.ERROR, false);
        panelRequest(reqParam)
          .then(res => panelParse(res, reqParam))
          .then((res) => {
            panelBeforeDataUpdate(this[panelKey], res);
            this[panelKey] = force
              ? res
              : panelDataCombine(this[panelKey], res);
            this[LASTREQPARAM] = reqParam;
            panelRequestCallback(this[panelKey]);
            this.$emit(PANEL_EVENT.LOADING, false);
            this.$emit(PANEL_EVENT.ERROR, false);
          }).catch(() => {
            this.$emit(PANEL_EVENT.LOADING, false);
            this.$emit(PANEL_EVENT.ERROR, true);
          });
      },
    },
    props: {
      ...otherBaseProps,
      ...dataPanelProps,
    },
    render(hoc) {
      const slots = keys(this.$slots)
        .reduce((arr, k) => arr.concat(this.$slots[k]), [])
        .map((vnode) => {
          // 手动更正 context 到高阶组件上
          vnode.context = this._self;
          return vnode;
        });

      const props = filterKeys(this.$props, dataPanelPropsKey);
      updateContextMethods(this, props);
      return hoc(Base, {
        on: this.$listeners,
        props: {
          ...props,
          // 通过 computed 的变更触发低阶组件的 props 变更
          [key]: this[key],
        },
        attrs: this.$attrs,
      }, slots);
    },
  };
}

export const IntersectionObserverHelper = IOH;
