import {
  createCach,
  isStyleVisible,
  isFunc,
} from './utils';
import {
  dataPanelPropsKey,
  PROPS_STATE,
  PROPS,
  METHODS,
} from './const';

const {
  REFRESH,
} = PROPS;

const {
  CHECKRELOAD,
} = METHODS;

const {
  freeze,
} = Object;

/**
 * 全局监听元素可见性
 */
export const IntersectionObserverHelper = (() => {
  let active = true;
  let globalActive = true;
  let intersectionObserver = null;
  const observerElMap = new WeakMap();
  const cach = createCach(observerElMap);

  return freeze({
    isActive(target) {
      const el = target || this.$el;
      const { isIntersecting } = cach.get(el) || {};
      return !document.hidden
        && document.visibilityState === 'visible' // tab 可见
        && active // 页面激活态
        && isIntersecting // 视窗内
        && isStyleVisible(el) // 样式可见
        && globalActive; // 暴露给外部使用，全局控制可见性
    },
    setGlobalActive() {
      globalActive = true;
    },
    setGlobalInActive() {
      globalActive = false;
    },
    setActive() {
      active = true;
    },
    setInActive() {
      active = false;
    },
    unlisten() {
      window.removeEventListener('focus', this.setActive, false);
      window.removeEventListener('blur', this.setInActive, false);
    },
    listen() {
      this.unlisten();
      window.addEventListener('focus', this.setActive, false);
      window.addEventListener('blur', this.setInActive, false);
    },
    register() {
      intersectionObserver = new IntersectionObserver((entries) => {
        entries.forEach(({ isIntersecting, target }) => {
          const elmProp = cach.get(target);
          if (!elmProp) {
            return;
          }
          const { callback } = elmProp;
          elmProp.isIntersecting = isIntersecting;
          cach.set(target, elmProp);
          if (this.isActive(target)) {
            if (typeof callback === 'function') {
              callback();
            }
          }
        });
      });
    },
    init(evtFlag = true) {
      this.register();
      // 默认绑定窗口 focus/blur 监听
      if (evtFlag) {
        this.listen();
      }
    },
    unwatch(el) {
      intersectionObserver.unobserve(el);
      cach.remove(el);
    },
    watch(component, callback) {
      const { $el: el } = component;
      intersectionObserver.observe(el);
      cach.set(el, {
        callback,
        component,
        isIntersecting: false,
      });
    },
  });
})();

/**
 * props 生成 watcher
 */
export const getPropWatchers = () => dataPanelPropsKey.reduce((dataPanel, k) => {
  if (!PROPS_STATE.includes(k)) {
    dataPanel[k] = function handleKeyChange() {
      return this[CHECKRELOAD]();
    };
  }
  return dataPanel;
}, {});

/**
 * 重写父组件刷新/重试方法
 * @param {*} comp
 * @param {*} props
 */
export const updateContextMethods = (comp, props) => {
  const { context: parent } = comp.$vnode;
  PROPS_STATE.forEach((key) => {
    if (key in props) {
      let methodKey = props[key];
      methodKey = isFunc(methodKey) ? methodKey.name.replace(/^bound /, '') : methodKey;
      if (methodKey) {
        const oldMethod = parent[methodKey];
        parent[methodKey] = () => {
          comp[CHECKRELOAD](key === REFRESH, key);
          if (isFunc(oldMethod)) {
            oldMethod.call(parent);
          }
        };
      }
    }
  });
};
