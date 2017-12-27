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

  function extend(source, target) {
    Object.keys(target).forEach(function(key) {
      source[key] = target[key];
    });
    return source;
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
        return store._set('single', key, result);
      }
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

  function triggerSuccess(inst) {
    var result = store.getSingle(inst.uuid);
    var callback = result.success;
    if (isFunction(callback)) {
      return reNewPromise(callback(inst[KEY.VALUE]));
    }
  };

  function triggerFail(inst) {
    var result = store.getSingle(inst.uuid);
    var fallback = result.fail;
    if (isFunction(fallback)) {
      return reNewPromise(fallback(inst[KEY.VALUE]));
    }
  };

  function resolve(res) {
    if (!isPending(this[KEY.STATUS])) return;
    this[KEY.VALUE] = res;
    this[KEY.STATUS] = CODE.RESOLVED;
    triggerSuccess(this);
  };

  function reject(rej) {
    if (!isPending(this[KEY.STATUS])) return;
    this[KEY.VALUE] = rej;
    this[KEY.STATUS] = CODE.REJECTED;
    triggerFail(this);
  };

  function Promise(callback) {
    if (!isFunction(callback)) {
      throw new TypeError('Promise resolver undefined is not a function');
    }
    initPromiseInst(this, callback);
    callback(resolve.bind(this), reject.bind(this));
    return this;
  };

  function reNewPromise(value) {
    var promise = new Promise();
    resolve.call(promise, value);
    return promise;
  };

  function initPromiseInst(inst) {
    inst.uuid = genUUID();
    inst[KEY.VALUE] = undefined;
    inst[KEY.STATUS] = CODE.PENDING;
    store.setSingle(inst.uuid, {
      instance: inst,
    });
  };

  function initPromise() {
    var proto = Promise.prototype;
    $define(Promise, 'all', {
      value: function () {

      },
    });

    $define(Promise, 'race', {
      value: function () {

      },
    });

    $define(Promise, 'resolve', {
      value: function () {

      },
    });

    $define(Promise, 'reject', {
      value: function () {

      },
    });

    $define(Promise, 'try', {
      value: function () {

      },
    });

    $define(proto, 'then', {
      value: function(success, fail) {
        var data = {};
        var status = this[KEY.STATUS];
        if (isFunction(success)) data.success = success;
        if (isFunction(fail)) data.fail = fail;
        store.setSingle(inst.uuid, data);

        if (isResolve(status)) {
          return triggerSuccess(this);
        } else if (isReject(status)) {
          return triggerFail(this);
        }
        return this;
      },
    });

    $define(proto, 'catch', {
      value: function(fail) {
        if (isFunction(fail)) data.fail = fail;
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
        // Promise.resolve()
      },
    });
  };

  initPromise();
  return Promise;
}));