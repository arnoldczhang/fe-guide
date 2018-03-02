void function __immer(global, factory) {
  if (typeof exports === 'object' && typeof module !== 'undefined') {
    return module.exports = factory(global);
  }

  if (typeof define === 'function' && define.amd) {
    return define(factory)
  }

  global.immer = {
    produce: factory(global),
  };
}(this || window, function __immerGlobal() {
  'use strict';

  /**
   * const
   */
  var default_handler = {
    get(target, prop, proxy) {

    },
    set(target, prop, value, proxy) {

    },
  };

  var KEY = {
    TARGET: '[[Target]]',
    HANDLER: '[[HANDLER]]',
    SYMBOL: '[[immer]]',
  };

  /**
   * utils
   */
  var isArray = Array.isArray;
  function bindDraft(parent, value, draft) {
    return draft[KEY.SYMBOL] = {
      parent: parent,
      value: value,
      copy: null,
    };
  };

  function isFunction(func) {
    return typeof func === 'function';
  };

  function isObject(obj) {
    return typeof obj === 'object';
  };

  function isUndefined(undef) {
    return undef === void 0;
  }

  function toArray(arrayLike) {
    var length = arrayLike.length;
    var result;
    if (length) {
      result = new Array(length);
      for (var i = 0; i < length; i += 1) {
        result[i] = arrayLike[i];
      }
    }
    return result;
  };

  function getResult(proxy, base) {
    if (isUndefined(proxy)) {
      proxy = base;
    }
    return proxy;
  };

  function bindProxy(state) {
    return new $Proxy(state, default_handler);
  };

  function isProxyable(state) {
    return isObject(state) && isObject(state.valueOf());
  };

  function shallowCopy(target) {
    var result = {};
    if (!isProxyable(target)) return target;
    if (isArray(target)) return toArray(target);
    Object.keys(target).forEach((key) => {
      result[key] = target[key];
    });
    return result;
  };


  /**
   * Proxy
   */
  function $Proxy(target, handler) {
    this.target = target;
    this[KEY.TARGET] = target;
    this[KEY.HANDLER] = handler;
    return this.init();
  };

  var proxyPro = $Proxy.prototype;
  proxyPro.init = function init() {
    this.isArray = isArray(this.target);
    // this.copy = shallowCopy(this.target);
    this.draft = this.isArray ? [] : {};
    return this.proxy().get();
  };

  proxyPro.get = function get() {
    return this.draft;
  };

  proxyPro.listen = function listen(target, key, value, draft) {
    var childDraft, draftValue;
    if (isObject(value)) {
      draftValue = isArray(value) ? [] : {};
      Object.defineProperty(draft, key, {
        get: function _getter() {
          return draftValue;
        },
        set: function _setter(val) {
          if (val !== draftValue) {
            target[key] = val;
          }
        },
      });
      bindDraft(target, value, draft);
      this.proxy(value, draftValue);
    } else {
      Object.defineProperty(draft, key, {
        get: function _getter() {
          return draftValue;
        },
        set: function _setter(val) {
          if (val !== draftValue) {
            draftValue = val;
          }
        },
      });
    }
  };

  proxyPro.proxy = function proxy(copy, draft) {
    var _this = this;
    copy = copy || _this.copy || this.target;
    draft = draft || _this.draft;
    if (!isArray(copy)) {
      Object.keys(copy).forEach(function objectKeyEach(key) {
        _this.listen(copy, key, copy[key], draft);
      });
    } else {
      copy.forEach(function copyEach(item, index) {
        _this.listen(copy, index, item, draft);
      });
    }
    return this;
  };

  /**
   * immer
   */
  function produce(baseState, callback) {
    var base;
    if (arguments.length) {
      if (arguments.length === 1) {
        if (isFunction(baseState)) {
          callback = baseState;
          baseState = null;
          var argsLength = callback.length;
          var argsQueue = [];
          function curry() {
            var args = toArray(arguments);
            if (args.length) {
              argsQueue = argsQueue.concat(args);
              if (argsQueue.length >= argsLength) {
                base = argsQueue[0];
                if (isProxyable(base)) {
                  baseState = bindProxy(base);
                  argsQueue[0] = baseState;
                  return getResult(callback.apply(baseState, argsQueue), base);
                }
              }
            }
            return curry;
          };
          return curry;
        } else {
          throw new Error('at least one param is need which typeof `function`');
        }
      } else {
        base = baseState;
        if (isProxyable(base)) {
          baseState = bindProxy(base);
          return getResult(callback.call(baseState, baseState), base);
        }
      }
    } else {
      throw new Error('missing arguments');
    }
  };
  return produce;
});
