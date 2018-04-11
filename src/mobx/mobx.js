void function __mobx(global, factory) {
  if (typeof exports === 'object' && typeof module !== 'undefined') {
    return module.exports = factory(global);
  }

  if (typeof define === 'function' && define.amd) {
    return define(factory)
  }

  global.mobx = factory(global);
}(this || window, function __globalFactory(G) {
  'use strict';

  /*************const****************/
  var MSG = {
    '001': 'the object must be observable',
    '002': 'the first arg of `autorun` must be function',
    '003': 'the key must be a string',
  };

  var CONST = {
    PENDING: false,
  };

  var FUNC = function FUNC(value) {
    return value;
  };

  var REACTION_CACH = {};

  var RUNTIME_FUNC;

  /*************common methods****************/
  function invariant(condition, format) {
    var args = arguments;
    var message;
    if (!condition) {
      if (format === void 0) {
        message = 'Internal mobx error';
      } else {
        if (isFunction(format)) {
          args = slice(toArray(args), 2);
          message = format.apply(null, args);
        } else {
          message = format;
        }
      }
      throw new Error(message);
    }
  };

  function slice(arraylike) {
    var result = arraylike;
    if (result.length) {
      if (!result.slice) {
        result = toArray(result);
      }
      result = result.slice(2);
    }
    return result;
  };

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

  var isArray = Array.isArray;
  var freeze = Object.freeze;
  var def = Object.defineProperty;

  function isObject(obj) {
    return typeof obj === 'object';
  };

  function isString(str) {
    return typeof str === 'string';
  };

  function isFunction(func) {
    return typeof func === 'function';
  };

  function isProxyable(obj) {
    return obj && isObject(obj) && isObject(obj.valueOf());
  };

  function keyEach(obj, callback) {
    callback = callback || FUNC;
    if (isProxyable(obj)) {
      Object.keys(obj).forEach(function __keyEach(key, index) {
        callback(key, obj[key], index);
      });
    }
    return obj;
  };

  function defValue(obj, key, value) {
    return def(obj, key, {
      value: value,
      enumerable: false,
      configurable: true,
      writable: true,
    });
  };

  function defPojo(obj, key, getter, setter) {
    return def(obj, key, {
      get: getter,
      set: setter,
      enumerable: false,
      configurable: true,
    });
  };

  function startRecode(func) {
    CONST.PENDING = true;
    RUNTIME_FUNC = func;
  };

  function endRecode(func) {
    CONST.PENDING = false;
    RUNTIME_FUNC = null;
  };

  /*************inner methods****************/
  function setValue(obj, state) {
    var value;
    var result = false;
    if ('values' in obj) {
      value = obj.values;
    } else {
      if (isProxyable(state)) {
        value = isArray(state) ? [] : {};
        result = true;
      } else {
        value = state;
      }
    }
    defValue(obj, 'values', value);
    return result;
  };

  function syncReaction(listener, key) {
    var watcher = listener.values[key];
    var id = watcher.$id;
    if (REACTION_CACH[id]) {
      defValue(watcher, watcher.KEY_REACT, REACTION_CACH[id]);
    }
    return watcher;
  };

  function bindWatcher(listener, key, value, options) {
    options = options || {};
    var parentWatcher = options.parentWatcher;
    var defTarget;
    var result = value;
    var parent = options.parent || listener;
    var watcher = parentWatcher && parentWatcher.values[key] || new Watcher(value, {
      parent: parent,
      $id: key,
    });

    function getter(_this) {
      return function __getter() {
        if (CONST.PENDING) {
          _this.watcher.addReaction(_this, RUNTIME_FUNC);
        }
        return result;
      };
    };

    function setter(_this) {
      return function __setter(newValue) {
        var watcher = _this.watcher;
        var key = _this.key;
        if (newValue !== result) {
          if (!isProxyable(newValue)) {
            result = newValue;
            watcher.updateValue(key, newValue);
          } else {
            watcher.batchUpdate(newValue);
          }
        }
      };
    };

    listener.values[key] = watcher;

    if (isProxyable(value)) {
      result = isArray(value) ? [] : {};
      listenTo(result, value, {
        parent: watcher,
        watcher: watcher,
      });
    }

    defTarget = {
      watcher: parent.getValue(key),
      key: key,
    };

    defPojo(listener, key, getter(defTarget), setter(defTarget));
    return syncReaction(listener, key);
  };

  function listenTo(listener, state, options) {
    options = options || {};
    if (!options.skipSetValue) {
      setValue(listener, state);
    }

    keyEach(state, function __keyEachC(key, value) {
      bindWatcher(listener, key, value, options);
    });
    return listener;
  };

  /**
   * [Watcher description]
   * @param {[type]} state   [description]
   * @param {[type]} options [description]
   */
  function Watcher(state, options) {
    this.init(state, options);
  };

  var watcherProto = Watcher.prototype;

  watcherProto.$id = '@Watcher';

  watcherProto.KEY_PROP = '__props';

  watcherProto.KEY_OPT = '__options';

  watcherProto.KEY_REACT = '__reactions';

  watcherProto.getOpts = function getOpts() {
    return this[this.KEY_OPT];
  };

  watcherProto.getOptsParent = function getOptsParent() {
    return this.getOpts().parent;
  };

  watcherProto.updateValue = function updateValue(key, newValue) {
    if (this.values === newValue) return;
    var parent = this.getOptsParent();
    this.values = newValue;
    if (parent) {
      parent[key] = newValue;
    }
    this.triggerReaction();
    return this;
  };

  watcherProto.batchUpdate = function batchUpdate(newValue, preOptions) {
    preOptions = preOptions || {};
    var options = this.getOpts();
    var parent = this.getOptsParent();
    if (parent) {
      return parent.batchUpdate(newValue, options);
    }
    bindWatcher(this, preOptions.$id, newValue, preOptions).triggerReaction();
    return this;
  };

  watcherProto.triggerReaction = function triggerReaction() {
    var reactions = this[this.KEY_REACT];
    if (reactions && reactions.length) {
      reactions.forEach(function __reactionEach(reaction) {
        return reaction.runtime();
      });
    }
    return this;
  };

  watcherProto.addReaction = function addReaction(target, func) {
    var key = target.key;
    var watcher = target.watcher;
    var id = watcher.$id;
    var reaction = new Reaction(watcher, key, func);

    if (!(this.KEY_REACT in watcher)) {
      defValue(watcher, this.KEY_REACT, []);
    }

    REACTION_CACH[id] = REACTION_CACH[id] || (REACTION_CACH[id] = []);
    REACTION_CACH[id].push(reaction)
    watcher[this.KEY_REACT].push(reaction);
    return this;
  };

  watcherProto.listen = function listen(state, options) {
    options = options || {};
    if (setValue(this, state)) {
      listenTo(this, state, {
        skipSetValue: true,
      });
    }
    return this;
  };

  watcherProto.init = function init(state, options) {
    return this.extend$id(options)
      .listen(state, options)
      .done();
  };
  
  watcherProto.extend$id = function extend$id(options) {
    options = options || {};
    var parent = options.parent;
    var id = options.$id;
    defValue(this, this.KEY_OPT, options);
    if (parent) {
      id = id ? '@' + id : '';
      defValue(this, '$id', parent.$id + id);
    }
    return this;
  };

  watcherProto.getValue = function getValue(key) {
    invariant(isString(key), MSG['003']);
    return this.values[key];
  };

  watcherProto.done = function done() {
    return freeze(this.getOpts()), this;
  };

  /**
   * [Reaction description]
   * @param {[type]} watcher [description]
   * @param {[type]} key     [description]
   * @param {[type]} func    [description]
   */
  function Reaction(watcher, key, func) {
    this.watcher = watcher;
    this.$key = key;
    this.runtime = func;
  };

  var reactionProto = Reaction.prototype;

  reactionProto.$id = '@Reaction';


  function getBasicWatcher(state, options) {
    state = state.valueOf();
    return new Watcher(state, options);
  };

  function getObjectWatcher(state, options) {
    return new Watcher(state, options);
  };

  /*************mobx core methods****************/
  function observable(obj, options) {
    invariant(obj, MSG['001']);
    if (isProxyable(obj)) {
      return getObjectWatcher(obj, options);
    }
    return getBasicWatcher(obj, options);
  };

  function autorun(func) {
    invariant(isFunction(func), MSG['002']);
    startRecode(func);
    func();
    endRecode(func);
  };

  return {
    observable: observable,
    autorun: autorun,
  };
});