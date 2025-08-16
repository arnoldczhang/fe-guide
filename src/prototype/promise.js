/*
Promise
注意点：
1.then、catch、finally相当于生成一个新的promise，入参根据之前一个promise的resolve或reject的return决定；
2.promise 状态一旦改变则不能再变
示例：
var promise = new Promise(function (resolve, reject) {
  ...
  resolve(...);
  reject(...);
});


也可以[参考](https: //mp.weixin.qq.com/s?__biz=MzA5NzkwNDk3MQ==&mid=2650590415&idx=1&sn=c95b0ee26a2602ac0f53701b8fb888f2&chksm=8891dcebbfe655fd50338afb6fe890f356e9e080a93349069a5a23be6fdfd16849fb9c2598dc&scene=38#wechat_redirect)
 */
;(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory(global) :
  typeof define === 'function' && define.amd ? define(factory) :
    (global.Promise = factory(global));
} (this || window, function (w) {'use strict';
  var FUNC = function () {};
  var $define = Object.defineProperty;
  var CODE = {
    SOME: 'some',
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
    return Math.random().toString(36).substring(2);
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
  var store = (function() {
    var store = {
      Q: {},
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

    $define(store, 'setQ', {
      value: function (key, value) {
        var result = store._get('Q', key);
        if (result) {
          extend(result, value);
        }
        return store._set('Q', key, result || value);
      },
    });

    $define(store, 'setMergeQ', {
      value: function (key, value) {
        var result = store._get('Q', key);
        if (result) {
          Object.keys(value).forEach(function(key) {
            var resValue = result[key];
            var setValue = value[key];
            if (Array.isArray(resValue)) {
              value[key] = resValue.concat(setValue);
            } else if (resValue) {
              value[key] = [resValue, setValue];
            } else {
              value[key] = setValue;
            }
          });
          extend(result, value);
        }
        return store._set('Q', key, result || value);
      },
    });

    $define(store, 'getQ', {
      value: function (key) {
        return store._get('Q', key);
      },
    });

    if (Object.freeze) {
      Object.freeze(store);
    }
    return store;
  } ());

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

  function iteratorCallback(thenable, handler, callback, value) {
    if (arguments.length < 4) {
      value = callback;
      return thenable.forEach(function(_this) {
        handler.call(_this, value);
      });
    }
    return thenable.forEach(function(_this, index) {
      var _callback = callback[index];
      handler.call(_this, _callback(value));
    });
  };

  function triggerPending(inst) {
    var data = {};
    var promise = new Promise(function(resolve, reject) {});
    data.promise = promise;
    store.setMergeQ(inst.uuid, data);
    return promise;
  };

  function abstractTrigger(inst, type, handler) {
    type = type || CODE.RESOLVED;
    handler = handler || resolveHandler;
    var result = store.getQ(inst.uuid);
    var value = inst[KEY.VALUE];
    var thenable = result.promise;
    var callback = result[isResolve(type) ? 'success' : 'fail'];
    var isThenableIterable = Array.isArray(thenable);
    var isCallbackIterable = Array.isArray(callback);
    var callbackValue;

    if (callback) {
      if (isFunction(callback)) {
        callbackValue = callback(value);
        if (thenable) resolveHandler.call(thenable, callbackValue);
        return reNewPromise(callbackValue, {
          type: type,
        });
      } else if (isCallbackIterable && isThenableIterable) {
        iteratorCallback(thenable, handler, callback, value);
      }
    } else if (isThenableIterable) {
      iteratorCallback(thenable, handler, value);
    } else if (thenable) {
      return handler.call(thenable, value);
    }
    return inst;
  };

  function triggerSuccess(inst) {
    return abstractTrigger(inst);
  };

  function triggerFail(inst) {
    return abstractTrigger(inst, CODE.REJECTED, rejectHandler);
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

  function getOnlyPromiseValue(input, resolve, reject) {
    if (Array.isArray(input)) {
      var done = false;
      var inp;
      for (var i = 0, length = input.length ; i < length; i += 1) {
        inp = input[i];
        if (!isPromise(inp)) {
          done = true;
          return resolve(inp);
        }
        inp.then(function(res) {
          if (done) return;
          done = true;
          resolve(res);
        }, function(err) {
          if (done) return;
          done = true;
          reject(err);
        });
      }
    }
  };

  function checkResolve(resolve, data) {
    const hasPromise = data.some(function(d) {
      return isPromise(d);
    });
    if (!hasPromise) resolve(data);
  };

  function abstractHandler(inst, res, status, callback) {
    status = status || CODE.RESOLVED;
    callback = callback || triggerSuccess;
    if (!isPending(inst[KEY.STATUS])) return;
    inst[KEY.VALUE] = res;
    inst[KEY.STATUS] = status;
    return callback(inst);
  };

  function resolveHandler(res) {
    return abstractHandler(this, res);
  };

  function rejectHandler(rej) {
    return abstractHandler(this, rej, CODE.REJECTED, triggerFail);
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
      case CODE.SOME: {
        return new Promise(function(resolve, reject) {
          getOnlyPromiseValue(value, resolve, reject);
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
    store.setQ(inst.uuid, {
      instance: inst,
    });
  };

  function initPromise() {
    var proto = Promise.prototype;
    $define(Promise, 'all', {
      value: function (iterator) {
        return reNewPromise(toArray(iterator), {
          type: CODE.ALL,
        });
      },
    });

    $define(Promise, 'race', {
      value: function (iterator) {
        return reNewPromise(toArray(iterator), {
          type: CODE.SOME,
        });
      },
    });

    $define(Promise, 'resolve', {
      value: function (input) {
        var value = input;
        var status = input && input[KEY.STATUS];

        if (isPromise(input)) {
          if (isPending(status)) {
            return triggerPending(input);
          } else {
            value = input[KEY.VALUE];
          }
        } else if (isObject(input) && isFunction(input.then)) {
            return reNewPromise(input.then, {
              type: CODE.FULLFILL,
            });
        }
        return reNewPromise(value, {
          type: status,
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
      value: function (callback) {
        try {
          return Promise.resolve(callback());
        } catch(err) {
          return Promise.reject(err);
        }
      },
    });

    $define(proto, 'then', {
      value: function(success, fail) {
        var data = {};
        var status = this[KEY.STATUS];
        if (isFunction(success)) data.success = success;
        if (isFunction(fail)) data.fail = fail;

        if (isPending(status)) {
          store.setMergeQ(this.uuid, data);
          return triggerPending(this);
        } else {
          if (isReject(status)) data.success = fail;
          store.setQ(this.uuid, data);
          return triggerSuccess(this);
        }
      },
    });

    $define(proto, 'catch', {
      value: function(fail) {
        var data = {};
        var status = this[KEY.STATUS];
        if (isFunction(fail)) data.fail = fail;

        if (isPending(status)) {
          store.setMergeQ(this.uuid, data);
          return triggerPending(this);
        } else if (isReject(status)) {
          store.setQ(this.uuid, data);
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
        return this.then(function(value) {
          return Promise.resolve(callback(value));
        }, function(error) {
          return Promise.resolve(callback(error));
        });
      },
    });
  };

  initPromise();
  return Promise;
}));