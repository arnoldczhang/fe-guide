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
  function updateSymbol(inst, draft, value, key) {
    var copy = 'copy' in this ? this.copy : shallowCopy(this.value);
    copy[key] = value;
    this.copy = copy;
    return {
      value: copy,
      draft: draft,
    };
  };

  function bindSymbol(parent, key, value, draft) {
    return Object.defineProperty(draft, KEY.SYMBOL, {
      value: {
        parent: parent,
        key: key,
        value: value,
        update: updateSymbol,
      },
      enumerable: false,
    });
  };

  function getSymbol(object) {
    if (isProxyable(object)) {
      return object[KEY.SYMBOL];
    }
    return false;
  };

  function getSymbolValue(symbol) {
    return 'copy' in symbol ? symbol.copy : symbol.value;
  };

  function batchUpdate(draft, value, key) {
    var draftSymbol = draft[KEY.SYMBOL];
    var result = draftSymbol.update(this, draft, value, key);
    if (draftSymbol.parent) {
      return this.batchUpdate(draftSymbol.parent, result.value, draftSymbol.key);
    }
    return result.draft;
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

  function keyEach(object, callback) {
    if (isProxyable(object)) {
      Object.keys(object).forEach(function innerKeyEach(key) {
        callback(object[key], key, object);
      });
    }
  };

  function getResult(proxy, base) {
    if (isUndefined(proxy)) {
      proxy = base;
    }
    var result = isArray(proxy) ? [] : {};
    keyEach(proxy, function resultKeyEach(value, key) {
      var hasSymbol = getSymbol(value);
      if (hasSymbol) {
        return result[key] = getSymbolValue(hasSymbol);
      }
      result[key] = value;
    });
    return result;
  };

  function bindProxy(state) {
    return new $Proxy(state, default_handler);
  };

  function isProxyable(state) {
    return state && isObject(state) && isObject(state.valueOf());
  };

  function shallowCopy(target) {
    var result = {};
    if (!isProxyable(target)) return target;
    if (isArray(target)) return toArray(target);
    keyEach(target, function shallowEach(value, key) {
      result[key] = value;
    });
    return result;
  };


  /**
   * Proxy
   */
  function $Proxy(target, handler) {
    this.target = target;
    this.copy = null;
    this[KEY.TARGET] = target;
    this[KEY.HANDLER] = handler;
    return this.init();
  };

  var proxyPro = $Proxy.prototype;
  proxyPro.batchUpdate = batchUpdate;
  proxyPro.init = function init() {
    this.draft = isArray(this.target) ? [] : {};
    bindSymbol(null, null, this.target, this.draft);
    return this.proxy().get();
  };

  proxyPro.get = function get() {
    return this.draft;
  };

  proxyPro.listen = function listen(key, value, draft) {
    var _this = this;
    var proxyValue = value;

    if (isProxyable(value)) {
      proxyValue = isArray(value) ? [] : {};
      bindSymbol(draft, key, value, proxyValue);
      _this.proxy(value, proxyValue);
    }

    Object.defineProperty(draft, key, {
      get: function _getter() {
        return proxyValue;
      },
      set: function _setter(newValue) {
        if (newValue !== value) {
          _this.batchUpdate(draft, newValue, key);
          proxyValue = value = newValue;
        }
      },
      enumerable: true,
    });
  };

  proxyPro.proxy = function proxy(copy, draft) {
    var _this = this;
    copy = copy || _this.copy || _this.target;
    draft = draft || _this.draft;
    if (!isProxyable(copy)) return copy;
    if (!isArray(copy)) {
      keyEach(copy, function objectKeyEach(value, key) {
        _this.listen(key, value, draft);
      });
    } else {
      copy.forEach(function copyEach(item, index) {
        _this.listen(index, item, draft);
      });
    }
    return _this;
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
          return getResult(callback.call(baseState, baseState), baseState);
        }
      }
    } else {
      throw new Error('missing arguments');
    }
  };
  return produce;
});
