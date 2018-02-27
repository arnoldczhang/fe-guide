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
  };

  /**
   * utils
   */
  var isArray = Array.isArray;
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


  /**
   * Proxy
   */
  function $Proxy(target, handler) {
    this.draft = {};
    this[KEY.TARGET] = target;
    this['[[Handler]]'] = handler;
    this.proxy();
    return this.draft;
  };

  var proxyPro = $Proxy.prototype;
  proxyPro.proxy = function proxy(target, draft) {
    var _this = this;
    target = target || _this[KEY.TARGET];
    draft = draft || _this.draft;
    Object.keys(target).forEach(function(key) {
      var value = target[key];
      var objValue;
      if (isObject(value)) {
        value = isArray(value) || 'length' in value ? [] : {};
        objValue = _this.proxy(target[key], value);
        Object.defineProperty(draft, key, {
          get: function _getter() {
            return objValue;
          },
          set: function _setter(val) {
            if (val !== objValue) {
              target[key] = objValue = val;
            }
          },
        });
        return;
      }

      Object.defineProperty(draft, key, {
        get: function _getter() {
          return target[key];
        },
        set: function _setter(val) {
          if (val !== target[key]) {
            target[key] = val;
          }
        }
      });
    });
    return draft;
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
