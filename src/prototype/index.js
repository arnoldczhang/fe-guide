/*
Promise
注意点：
1.then、catch、finally相当于生成一个新的promise，
  入参根据之前一个promise的resolve或reject的return决定；
示例：
var promise = new Promise(function (resolve, reject) {
  ...
  resolve(...);
  reject(...);
});
 */
;(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory(global) :
  typeof define === 'function' && define.amd ? define(factory) :
    (global.Promise = factory(global));
} (this || window, function (w) {'use strict';
  var FUNC = function () {};
  var $define = Object.defineProperty;
  var CODE = {
    ALL: 'all',
    FULLFILL: 'fullfill',
    PENDING: 'pending',
    RESOLVED: 'resolved',
    REJECTED: 'rejected',
  };
  
  var KEY = {
    VALUE: '[[PromiseValue]]',
    STATUS: '[[PromiseStatus]]',
  };

  /*
  utils
   */
  function genUUID() {
    return Number(String(Math.random()).substr(2)).toString(36);
  };

  function isFunction (func) {
    return typeof func === 'function';
  };

  function isObject(obj) {
    return typeof obj === 'object';
  };

  function extend(source, target) {
    Object.keys(target).forEach(function(key) {
      source[key] = target[key];
    });
    return source;
  };

  function toArray(arrayLike) {
    var length = arrayLike.length;
    var result = [];
    for (var i = 0; i < length; i += 1) {
      result[i] = arrayLike[i];
    }
    return result;
  };

  function isPromise(promise) {
    return promise instanceof Promise;
  };

  /*
  store
   */
  var store = {
    queue: {},
    single: {},
  };

  $define(store, '_set', {
    value: function (map, key, value) {
      store[map][key] = value;
    },
  });

  $define(store, '_get', {
    value: function (map, key) {
      return store[map][key];
    },
  });

  $define(store, 'setQueue', {
    value: function (key, value) {
      return store._set('queue', key, value);
    },
  });

  $define(store, 'getQueue', {
    value: function (key) {
      return store._get('queue', key);
    },
  });

  $define(store, 'setSingle', {
    value: function (key, value) {
      var result = store._get('single', key);
      if (result) {
        extend(result, value);
      }
      return store._set('single', key, result || value);
    },
  });

  $define(store, 'getSingle', {
    value: function (key) {
      return store._get('single', key);
    },
  });

  if (Object.freeze) {
    Object.freeze(store);
  }

  /*
  promise
   */
  function isPending(code) {
    return code === CODE.PENDING;
  };

  function isResolve(code) {
    return code === CODE.RESOLVED;
  };

  function isReject(code) {
    return code === CODE.REJECTED;
  };

  function triggerPending(inst) {
    var data = {};
    var promise = new Promise(function(resolve, reject) {});
    data.promise = promise;
    store.setSingle(inst.uuid, data);
    return promise;
  };

  function triggerSuccess(inst) {
    var result = store.getSingle(inst.uuid);
    var thenable = result.promise;
    var callback = result.success;

    if (isFunction(callback)) {
      var callbackValue = callback(inst[KEY.VALUE]);
      if (thenable) resolveHandler.call(thenable, callbackValue);
      return reNewPromise(callbackValue);
    }
  };

  function triggerFail(inst) {
    var result = store.getSingle(inst.uuid);
    var thenable = result.promise;
    var fallback = result.fail;

    if (isFunction(fallback)) {
      var fallbackValue = fallback(inst[KEY.VALUE]);
      if (thenable) resolveHandler.call(thenable, fallbackValue);
      return reNewPromise(fallbackValue, {
        type: CODE.REJECTED,
      });
    }
  };

  function getBatchPromiseValue(input, resolve, reject) {
    var result = [];
    if (Array.isArray(input)) {
      input.forEach((inp, index, array) => {
        if (isPromise(inp)) {
          if (isPending(inp[KEY.STATUS])) {
            result[index] = inp;
            inp.then((function(i) {
              return function(res) {
                if (!result) return;
                result[i] = res;
                return checkResolve(resolve, result), res;
              };
            } (index)), function(err) {
              result = null;
              return reject(err), err;
            });
          } else {
            result[index] = inp[KEY.VALUE];
          }
        } else {
          result[index] = inp;
        }
      });
    }
  };

  function checkResolve(resolve, data) {
    const hasPromise = data.some(function(d) {
      return isPromise(d);
    });
    if (!hasPromise) resolve(data);
  };

  function resolveHandler(res) {
    if (!isPending(this[KEY.STATUS])) return;
    this[KEY.VALUE] = res;
    this[KEY.STATUS] = CODE.RESOLVED;
    return triggerSuccess(this);
  };

  function rejectHandler(rej) {
    if (!isPending(this[KEY.STATUS])) return;
    this[KEY.VALUE] = rej;
    this[KEY.STATUS] = CODE.REJECTED;
    return triggerFail(this);
  };

  function Promise(callback) {
    if (!isFunction(callback)) {
      throw new TypeError('Promise resolver undefined is not a function');
    }
    var thisResolve = resolveHandler.bind(this);
    var thisReject = rejectHandler.bind(this);
    initPromiseInst(this, callback);
    try {
      callback(thisResolve, thisReject);
    } catch(err) {
      thisReject(err);
    }
    return this;
  };

  function reNewPromise(value, options) {
    options = options || {};
    switch(options.type) {
      case CODE.FULLFILL: {
        return new Promise(value);
      }
      case CODE.REJECTED: {
        return new Promise(function(resolve, reject) {
          reject(value);
        });
      }
      case CODE.ALL: {
        return new Promise(function(resolve, reject) {
          getBatchPromiseValue(value, resolve, reject);
        });
      }
      case CODE.RESOLVED:
      default: {
        return new Promise(function(resolve) {
          resolve(value);
        });
      }
    };
  };

  function initPromiseInst(inst) {
    $define(inst, 'uuid', {
      enumerable: false,
      configurable: false,
      writable: false,
      value: genUUID(),
    });
    inst[KEY.VALUE] = undefined;
    inst[KEY.STATUS] = CODE.PENDING;
    store.setSingle(inst.uuid, {
      instance: inst,
    });
  };

  function initPromise() {
    var proto = Promise.prototype;
    $define(Promise, 'all', {
      value: function (iterator) {
        var args = toArray(iterator);
        return reNewPromise(args, {
          type: CODE.ALL,
        });
      },
    });

    $define(Promise, 'race', {
      value: function () {
        // TODO
      },
    });

    $define(Promise, 'resolve', {
      value: function (input) {
        var value = input;
        if (isPromise(input)) {
          value = input[KEY.VALUE];
        } else if (isObject(input) && isFunction(input.then)) {
            return reNewPromise(input.then, {
              type: CODE.FULLFILL,
            });
        }
        return reNewPromise(value, {
          type: input[KEY.STATUS],
        });
      },
    });

    $define(Promise, 'reject', {
      value: function (input) {
        return reNewPromise(input, {
          type: CODE.REJECTED,
        });
      },
    });

    $define(Promise, 'try', {
      value: function () {
        // TODO
      },
    });

    $define(proto, 'then', {
      value: function(success, fail) {
        var data = {};
        var status = this[KEY.STATUS];
        if (isFunction(success)) data.success = success;
        if (isFunction(fail)) data.fail = fail;
        if (isPending(status)) {
          store.setSingle(this.uuid, data);
          return triggerPending(this, data);
        } else {
          if (isReject(status)) data.success = fail;
          store.setSingle(this.uuid, data);
          return triggerSuccess(this);
        }
      },
    });

    $define(proto, 'catch', {
      value: function(fail) {
        var data = {};
        var status = this[KEY.STATUS];
        if (isFunction(fail)) data.fail = fail;
        store.setSingle(this.uuid, data);
        if (isReject(status)) {
          return triggerFail(this);
        }
        return this;
      },
    });

    $define(proto, 'done', {
      value: function(success, fail) {
        this.then(success, fail)
          .catch(function(error) {
            if (error) setTimeout(function()  {
              throw error;
            });
          });
      },
    });

    $define(proto, 'finally', {
      value: function(callback) {
        // TODO
        // Promise.resolve()
      },
    });
  };

  initPromise();
  return Promise;
}));