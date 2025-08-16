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
  let active = document.hasFocus();
  let globalActive = true;
  let bindEvt = false;
  let intersectionObserver = null;
  // 缓存视窗激活态时，元素对应信息
  const observerElMap = new WeakMap();
  // 缓存 focus/blur 时，元素对应信息
  const activeMap = new Map();
  const cach = createCach(observerElMap);

  return freeze({

    /**
     * check global active state
     * @param {*} target
     */
    isActive(target = this.$el) {
      const el = (Array.isArray(target) ? this.$el : target) || this.$el;
      const { isIntersecting } = cach.get(el) || {};
      if (bindEvt) {
        if (!active && Array.isArray(target)) {
          // 缓存 blur 时触发的激活函数
          const [inst, instCb, ...args] = target;
          activeMap.set(inst, [instCb, ...args]);
          return false;
        }
      }

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
      const mKeys = activeMap.keys();
      let next = mKeys.next();
      while (!next.done) {
        const { value } = next;
        const [cb, ...args] = activeMap.get(value);
        cb.apply(value, args, value);
        activeMap.delete(value);
        next = mKeys.next();
      }
    },

    setInActive() {
      active = false;
    },

    unlisten() {
      window.removeEventListener('focus', this.setActive);
      window.removeEventListener('blur', this.setInActive);
    },

    listen() {
      this.unlisten();
      window.addEventListener('focus', this.setActive);
      window.addEventListener('blur', this.setInActive);
    },

    register() {
      intersectionObserver = new IntersectionObserver((entries) => {
        entries.forEach(({ isIntersecting, target }) => {
          const elmProp = cach.get(target);
          if (!elmProp) {
            return;
          }
          const { callback, fallback } = elmProp;
          elmProp.isIntersecting = isIntersecting;
          cach.set(target, elmProp);
          const activeState = this.isActive(target);
          if (isIntersecting) {
            if (isFunc(callback)) {
              callback(activeState);
            } else if (Array.isArray(callback)) {
              callback.forEach(cb => isFunc(cb) && cb(activeState));
            }
          } else if (fallback) {
            if (isFunc(fallback)) {
              fallback();
            } else if (Array.isArray(fallback)) {
              fallback.forEach(fb => isFunc(fb) && fb());
            }
          }
        });
      });
    },

    init(evtFlag = true) {
      this.register();
      bindEvt = evtFlag;
      // 默认绑定窗口 focus/blur 监听
      if (bindEvt) {
        this.listen();
      }
    },

    unwatch(el) {
      intersectionObserver.unobserve(el);
      cach.remove(el);
    },

    watch(component, cb, fb) {
      const { $el: el } = component;
      const callback = [];
      const fallback = [];
      const elCach = cach.get(el);
      if (elCach) {
        elCach.callback.push(cb);
        if (isFunc(fb)) {
          elCach.fallback.push(fb);
        }
      } else {
        intersectionObserver.observe(el);
        callback.push(cb);
        if (isFunc(fb)) {
          fallback.push(fb);
        }
        cach.set(el, {
          callback,
          fallback,
          component,
          isIntersecting: false,
        });
      }
    },
  });
})();

/**
 * props 生成 watcher
 */
export const getPropWatchers = () => dataPanelPropsKey.reduce((res, k) => {
  if (!PROPS_STATE.includes(k)) {
    res[k] = function handleKeyChange() {
      return this[CHECKRELOAD]();
    };
  }
  return res;
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
