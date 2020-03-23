import dateformat from 'dateformat';
import {
  noop,
  genRand,
  filterKeys,
  shallowVueEq,
  toConn,
  isFunc,
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
  LASTOUTREQPARAM,
  LASTDATA,
  RELOADTIME,
  RELOADING,
  ONCE,
  BASEINSTANCE,
  MANUALCHANGE,
} = DATA;

const {
  REQUESTPARAM,
  REQUEST,
  BEFOREPARSE,
  PARSE,
  BEFOREDATAUPDATE,
  REQUESTCALLBACK,
  BEFOREREQUESTCALLBACK,
  DATACOMBINE,
  DEFAULT,
} = PROPS;

const {
  KEY,
  FETCHKEY,
  INCREMENT,
  GETINTERVAL,
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
    [GETINTERVAL]: getInterval,
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
        // 上次外部入参（目前没用到）
        [LASTOUTREQPARAM]: null,
        // 上次数据
        [LASTDATA]: null,
        // 请求间隔
        [RELOADTIME]: 1000,
        // 请求态
        [RELOADING]: false,
        // 首次成功请求标志（首次请求失败，重置）
        [ONCE]: true,
        // 子组件实例
        [BASEINSTANCE]: null,
        // 手动变更标记（外部力量强行修改入参，则优先用外部入参）
        [MANUALCHANGE]: false,
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
          [BASEINSTANCE]: inst,
        } = this;
        // 首次请求失败的情况，仍用原参数请求
        if (!lastReqParam) {
          this[LASTOUTREQPARAM] = requestParam;
          return requestParam;
        }

        if (isFunc(getInterval) && incrementKey.length) {
          const startKey = incrementKey[0];
          const increType = increment[startKey].type;
          // 判断时间间隔内的变动，是手动变更还是自增
          if (!increType || increType === Date) {
            if (getInterval.call(inst) === true) {
              // 如果是手动变更，记录手动标记，直至下次请求成功
              this[MANUALCHANGE] = true;
              return requestParam;
            }
          }
        }

        // 如果上次请求是手动变更&请求失败，重新用上次入参请求
        if (this[MANUALCHANGE]) {
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
          const checkReload = this[CHECKRELOAD];
          const oldFetchFn = this[BASEINSTANCE][fetchKey];
          if (typeof oldFetchFn !== 'function') {
            throw new Error('未找到 fetchKey 对应的方法');
          }
          this[BASEINSTANCE][fetchKey] = function proxyFetchFn(...args) {
            if (isActiveFn([this, checkReload])) {
              oldFetchFn.apply(this, ...args);
            }
          };
        }
      },
      [CHECKRELOAD](
        // 重新请求 or 自增请求
        force = !increment,
        // 重新请求 or 异常重新请求
        propKey = '',
        // 焦点变更触发的 reload
        focusFlag = false
      ) {
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
        if (!this[ISACTIVE]([this, this[CHECKRELOAD], force, propKey])
          || reloading || this._inactive) {
          return;
        }

        this[RESET]();

        let reqParam;
        const forceRefresh = force || !increment || once;
        // 重新聚焦，优先取上次请求参数，没有则取外部入参
        if (focusFlag) {
          reqParam = lastReqParam || panelRequestParam;
          if (!lastReqParam) {
            this[LASTOUTREQPARAM] = reqParam;
          }
          this[ONCE] = false;
        } else if (forceRefresh) {
          reqParam = panelRequestParam;
          this[LASTOUTREQPARAM] = reqParam;
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

        this[DOREQUEST](reqParam, forceRefresh || reqParam === panelRequestParam);
      },
      [DOREQUEST](reqParam, force) {
        const {
          [REQUEST]: panelRequest = noop,
          [BEFOREPARSE]: panelBeforeParse = noop,
          [PARSE]: panelParse = noop,
          [BEFOREDATAUPDATE]: panelBeforeDataUpdate = noop,
          [DATACOMBINE]: panelDataCombine = noop,
          [REQUESTCALLBACK]: panelRequestCallback = noop,
          [BEFOREREQUESTCALLBACK]: panelBeforeRequestCallback = noop,
        } = this;
        this.$emit(PANEL_EVENT.LOADING, true);
        this.$emit(PANEL_EVENT.ERROR, false);
        panelRequest(reqParam)
          .then(panelBeforeParse)
          .then(res => panelParse(res, reqParam))
          .then((res) => {
            panelBeforeDataUpdate(this[panelKey], res);
            this[LASTDATA] = force ? res : panelDataCombine(this[LASTDATA], res);
            this[LASTREQPARAM] = reqParam;
            this[MANUALCHANGE] = false;
            this[panelKey] = panelBeforeRequestCallback(this[LASTDATA]);
            panelRequestCallback(this[panelKey]);
            this.$emit(PANEL_EVENT.LOADING, false);
            this.$emit(PANEL_EVENT.ERROR, false);
          })
          .catch(() => {
            if (!this[LASTDATA]) {
              this[ONCE] = true;
            }
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

      updateContextMethods(this, this.$props);
      const props = filterKeys(this.$props, dataPanelPropsKey);
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
