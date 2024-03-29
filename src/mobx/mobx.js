void function __mobx(global, factory) {
  if (typeof exports === 'object' && typeof module !== 'undefined') {
    return module.exports = factory(global);
  }

  if (typeof define === 'function' && define.amd) {
    return define(factory)
  }

  global.mobx = factory(global);
  return global.mobx;
}(this || window, function __globalFactory(G) {
  'use strict';

  var Symbol = typeof G.Symbol !== undefined ? G.Symbol : function Symbol(value) {
    return value;
  };

  /*************const****************/
  var CONST = {
    KLASS_REACTION: '__mobx_observer_klass_reaction',
    KLASS_COMPUTED: '__mobx_observer_klass_computed',
    VALUES: '__mobx_values',
    WATCHER: '@Watcher',
    WATCHER_ID: '__mobx_watcher_id',
    REACTION_ID: '__mobx_reaction_id',
    REACTION_KEY: '__reactions',
    OPT_KEY: '__options',
  };

  var MSG = {
    '001': 'the object must be observable',
    '002': 'the first arg of `autorun` must be function',
    '003': 'the key must be a string',
    '004': 'the key must be an object',
    '005': 'the key `' + CONST.WATCHER_ID + '` is used by mobx',
  };

  var FUNC = function FUNC(value) {
    return value;
  };

  var WATCHER = {
    INDEX: 0,
  };

  var REACTION = {
    INDEX: 0,
    PENDING: false,
    BINDING: false,
    CACH: {},
    NAME: null,
    FUNC: null,
  };

  var COMPUTED = {
    BINDING: false,
  };

  /*************common methods****************/
  var isArray = Array.isArray;
  var freeze = Object.freeze;
  var def = Object.defineProperty;
  var keys = Object.keys;
  var arrayEach = Array.prototype.forEach;
  var call = arrayEach.call;

  function getMessage(id) {
    var msg = MSG[id];
    if (isString(msg)) {
      return msg;
    }
    var args = slice(toArray(id), 1);
    return msg.apply(null, args);
  };

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

  function forEach(arrayLike) {
    if (arrayLike && arrayLike.length) {
      call.apply(arrayEach, arguments);
    }
    return arrayLike;
  };

  function slice(arraylike, startIndex) {
    var result = arraylike;
    if (result.length) {
      if (!result.slice) {
        result = toArray(result);
      }
      result = result.slice(startIndex);
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

  function isObserver(obj) {
    return obj instanceof Watcher;
  };

  function isKlass(klass) {
    return klass
      && klass.constructor
      && klass === klass.constructor.prototype;
  };

  function isDescriptor(descriptor) {
    return 'enumerable' in descriptor
      && 'configurable' in descriptor
      && ('initializer' in descriptor
        || 'value' in descriptor
        || ('get' in descriptor
          || 'set' in descriptor));
  };

  function listenEachState(obj, callback) {
    callback = callback || FUNC;
    if (isProxyable(obj)) {
      obj = hasValue(obj) && getValue(obj) || obj;
      forEach(keys(obj), function __keyEach(key, index) {
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
      get: getter || FUNC,
      set: setter || FUNC,
      enumerable: false,
      configurable: true,
    });
  };

  function handleBind(target, bool) {
    bool = bool || false;
    if (isArray(target)) {
      forEach(target, function __each(t) {
        t.BINDING = bool;
      });
    } else {
      target.BINDING = bool;
    }
  };

  function startBind(target) {
    handleBind(target, true);
  };

  function endBind(target) {
    handleBind(target, false);
  };

  function startRecode(func) {
    ++REACTION.INDEX;
    REACTION.PENDING = true;
    REACTION.FUNC = func;
  };

  function endRecode(func) {
    REACTION.PENDING = false;
    REACTION.FUNC = null;
    REACTION.NAME = null;
  };

  /*************inner methods****************/
  function hasValue(obj) {
    return CONST.VALUES in obj;
  };

  function getValue(obj, key) {
    var _this = obj;
    if (this) {
      key = obj;
      _this = this;
    }

    var value = _this[CONST.VALUES];
    if (key && isString(key)) {
      return value[key];
    }
    return value;
  };

  function modifyValue(obj, key, state) {
    invariant(isString(key), getMessage('003'));
    if (!hasValue(obj)) {
      defValue(obj, CONST.VALUES, {});
    }
    obj[CONST.VALUES][key] = state;
  };

  function setValue(obj, state) {
    var value = arguments.length > 1 ? state : {};
    var result = false;
    if (hasValue(obj)) {
      value = getValue(obj);
    } else {
      if (isProxyable(state)) {
        value = isArray(state) ? [] : {};
        result = true;
      }
      defValue(obj, CONST.VALUES, value);
    }
    return result;
  };

  function addReaction(target, key, func) {
    var _this = this || target;

    if (isFunction(key)) {
      func = key;
      key = target.key;
    }

    var reactKey = _this.KEY_REACT || CONST.REACTION_KEY;
    var $id = _this[CONST.WATCHER_ID];
    var reaction = new Reaction(_this, key, func);

    if (!(reactKey in target)) {
      defValue(_this, reactKey, []);
    }

    REACTION.CACH[$id] = REACTION.CACH[$id] || (REACTION.CACH[$id] = []);
    REACTION.CACH[$id].push(reaction);
    _this[reactKey].push(reaction);
    return _this;
  };

  function updateValue(target, key, newValue) {
    if (arguments.length <= 2) {
      newValue = key;
      key = target;
    }

    var watcher;
    var _this = this || target;
    var valueKey = CONST.VALUES;
    if (getValue(_this) === newValue) return;

    if (this) {
      var parent = this.getOptsParent();
      this[valueKey] = newValue;
      if (parent) {
        parent[key] = newValue;
      }
      this.triggerReaction();
      return this;
    }

    _this[key] = newValue;
    watcher = _this[valueKey][key];
    watcher[valueKey] = newValue;
    triggerReaction(watcher);
    return _this;
  };

  function batchUpdate(target, newValue, preOptions) {
    if (arguments.length <= 2) {
      preOptions = newValue;
      newValue = target;
    }
    var _this = this || target;
    preOptions = preOptions || {};
    if (isObserver(_this)) {
      var options = _this.getOpts();
      var parent = _this.getOptsParent();
      if (parent) {
        if (isObserver(parent)) {
          return parent.batchUpdate(newValue, options);
        }
        return batchUpdate(parent, newValue, options);
      }
    }
    bindWatcher(_this, preOptions.$id, newValue, preOptions).triggerReaction();
    return _this;
  };

  function getOpts(target) {
    var _this = this || target;
    var opts = _this.KEY_OPT || CONST.OPT_KEY;
    return _this[opts] || {};
  };

  function getOptsParent(target) {
    var _this = this || target;
    return (this ? _this.getOpts() : getOpts(_this)).parent;
  };

  function triggerReaction(target) {
    var _this = this || target;
    var reactKey = _this.KEY_REACT || CONST.REACTION_KEY;
    var reactions = _this[reactKey];
    if (reactions && reactions.length) {
      forEach(reactions, function __reactionEach(reaction) {
        return reaction.runtime();
      });
    }
    return _this;
  };

  function syncReaction(listener, key) {
    var watcher = getValue(listener, key);
    var id = watcher[CONST.WATCHER_ID];
    if (REACTION.CACH[id]) {
      defValue(watcher, watcher.KEY_REACT, REACTION.CACH[id]);
    }
    return watcher;
  };

  function pushWatcher(listener, key, value, watcher, callback) {
    getValue(listener)[key] = watcher;
    if (!isObserver(value) && isProxyable(value) && isFunction(callback)) {
      callback(value);
    }
  };

  function bindWatcher(listener, key, value, options) {
    options = options || {};
    var parentWatcher = options.parentWatcher;
    var defTarget;
    var result = value;
    var parent = options.parent || listener;
    invariant(isObject(parent), getMessage('004'));
    var watcher = parentWatcher && getValue(parentWatcher, key) || new Watcher(value, {
      parent: parent,
      parentKey: options.parentKey || '',
      $id: key,
    });

    function getter(_this) {
      return function __getter() {
        if (COMPUTED.BINDING) {
          return result;
        }

        if (REACTION.PENDING) {
          if (isObserver(_this.watcher)) {
            _this.watcher.addReaction(_this, REACTION.FUNC);
          } else {
            var childWatcher = getValue(_this.watcher, key);
            if (childWatcher) {
              addReaction(childWatcher, key, REACTION.FUNC);
            }
          }
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
            if (watcher.updateValue) {
              watcher.updateValue(key, newValue);
            } else {
              updateValue(watcher, key, newValue);
            }
          } else if (isObserver(watcher)) {
            watcher.batchUpdate(newValue);
          } else {
            batchUpdate(watcher, newValue, { $id: key });
          }
        }
      };
    };

    pushWatcher(listener, key, value, watcher, function __pushCallback(val) {
      result = isArray(val) ? [] : {};
      listenTo(result, val, {
        parent: watcher,
        watcher: watcher,
      });
    });

    defTarget = {
      watcher: parent.getValue && parent.getValue(key) || listener,
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

    listenEachState(state, function __keyEachC(key, value) {
      bindWatcher(listener, key, value, options);
    });
    return listener;
  };

  function getPureWatcher(target, options) {
    var includeArray = options.include;
    invariant(!(CONST.WATCHER_ID in target), getMessage('005'));
    defValue(target, CONST.WATCHER_ID, CONST.WATCHER + '@' + WATCHER.INDEX);
    startBind(REACTION);

    if (isArray(includeArray)) {
      forEach(includeArray, function __includeEach(key) {
        var value = target[key];
        var result = value;
        var watcher = new Watcher(value, {
          parent: target,
          $id: key,
        });
        pushWatcher(target, key, value, watcher);
      });
    } else if (includeArray) {
      forEach(keys(target), function __keyEach(key) {
        bindWatcher(target, key, target[key], options);
      });
    }
    endBind(REACTION);
  };

  function bindDecorator(input, key, descriptor) {
    var result = 'value' in descriptor && descriptor.value || descriptor.initializer();

    function getter(_this) {
      return function __getter() {
        if (COMPUTED.BINDING) {
          return result;
        }

        if (REACTION.PENDING) {
          createPureWatcher(_this);
          createComputedWatcher(_this);

          if (!REACTION.BINDING) {
            addReaction(getValue(_this, key), key, REACTION.FUNC);
          }
        }
        return result;
      };
    };

    function setter(_this) {
      return function __setter(newValue) {
        if (result !== newValue) {
          var watcher = getValue(_this, key);
          if (!isProxyable(newValue)) {
            result = newValue;
            if (watcher.updateValue) {
              watcher.updateValue(key, newValue);
            }
          } else {
            watcher.batchUpdate(newValue);
          }
        }
      }
    };

    if (isProxyable(result)) {
      result = createPureWatcher(result, {
        key: key,
        isAll: true,
      });
    }
    return defPojo(input, key, getter(input), setter(input));
  };

  function createComputedWatcher(target, options) {
    options = options || {};
    var computeds = target[CONST.KLASS_COMPUTED];
    var computedKey;

    if (isArray(computeds)) {
      startBind(COMPUTED);
      while (computeds.length) {
        computedKey = computeds.pop();
        var watcher = new Watcher(target[computedKey], {
          computed: true,
        });
        modifyValue(target, computedKey, watcher);
      }
      target[CONST.KLASS_COMPUTED] = null;
      endBind(COMPUTED);
    }
  };

  function createPureWatcher(target, options) {
    options = options || {};
    if (!hasValue(target)) {
      setValue(target);
      observable(target, {
        pure: true,
        parentKey: options.key || '',
        include: options.isAll || target[CONST.KLASS_REACTION],
      });
    }
    return target;
  };

  /**
   * Watcher
   * @param {[type]} state   [description]
   * @param {[type]} options [description]
   */
  function Watcher(state, options) {
    options = options || {};
    if (state instanceof Watcher) {
      return state.updateProps(options);
    }

    if (options.computed) {
      defValue(this, CONST.VALUES, state);
      return this;
    }
    this.init(state, options);
  };

  var watcherProto = Watcher.prototype;

  watcherProto[CONST.WATCHER_ID] = CONST.WATCHER;

  watcherProto.KEY_PROP = '__props';

  watcherProto.KEY_OPT = CONST.OPT_KEY;

  watcherProto.KEY_REACT = CONST.REACTION_KEY;

  watcherProto.addReaction = addReaction;

  watcherProto.getValue = getValue;

  watcherProto.batchUpdate = batchUpdate;

  watcherProto.updateValue = updateValue;

  watcherProto.getOpts = getOpts;

  watcherProto.getOptsParent = getOptsParent;

  watcherProto.triggerReaction = triggerReaction;

  watcherProto.getId = function getId() {
    return this[CONST.WATCHER_ID];
  };

  watcherProto.updateProps = function updateProps(options) {
    options = options || {};
    defValue(this, this.KEY_OPT, options);
    return this;
  };

  watcherProto.listen = function listen(state) {
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
    var parentKey = options.parentKey;
    var parent = options.parent;
    var idStr = options.$id;
    var parentId;
    var defaultId = this.getId() + '@' + WATCHER.INDEX;
    defValue(this, this.KEY_OPT, options);
    if (parent) {
      parentId = parent[CONST.WATCHER_ID] || defaultId;
      if (parentKey) {
        parentId += '.' + parentKey;
      }
      idStr = idStr ? '.' + idStr : '';
      defValue(this, CONST.WATCHER_ID, parentId +  idStr);
    } else {
      defValue(this, CONST.WATCHER_ID, defaultId);
    }
    return this;
  };

  watcherProto.done = function done() {
    return freeze(this.getOpts()), this;
  };

  /**
   * Reaction
   * @param {[type]} watcher [description]
   * @param {[type]} key     [description]
   * @param {[type]} func    [description]
   */
  function Reaction(watcher, key, func) {
    this.watcher = watcher;
    this.runtime = func;
    defValue(this, '$key', key);
    this.init();
  };

  var reactionProto = Reaction.prototype;

  reactionProto.$id = '@Reaction';

  reactionProto.init = function init() {
    this.extend$id();
  };

  reactionProto.extend$id = function extend$id() {
    if (REACTION.NAME) {
      defValue(this, CONST.REACTION_ID, this.$id + '@' + REACTION.INDEX + '@' + REACTION.NAME);
    }
  };

  function getBasicWatcher(state, options) {
    state = state.valueOf();
    return new Watcher(state, options);
  };

  function getObjectWatcher(state, options) {
    return new Watcher(state, options);
  };

  /*************mobx core methods****************/
  function observable() {
    var args = toArray(arguments);
    var input = args[0];
    var options = args[1] || {};
    var descriptor;

    invariant(input, getMessage('001'));

    if (options.pure) {
      return getPureWatcher(input, options);
    }

    if (args.length === 3) {
      invariant(isString(options), getMessage('003'));
      descriptor = args[2];

      if (isKlass(input) && isDescriptor(descriptor)) {
        if (!(CONST.KLASS_REACTION in input)) {
          defValue(input, CONST.KLASS_REACTION, []);
        }
        input[CONST.KLASS_REACTION].push(options);
        return bindDecorator(input, options, descriptor);
      }
    }

    ++WATCHER.INDEX;

    if (isObserver(input)) {
      return input;
    }

    if (isProxyable(input)) {
      return getObjectWatcher(input, options);
    }
    return getBasicWatcher(input, options);
  };

  function autorun(name, func, context) {
    if (isString(name)) {
      REACTION.NAME = name;
    } else if (isFunction(name)) {
      REACTION.NAME = null;
      context = func;
      func = name;
    }

    context = context || null;
    invariant(isFunction(func), getMessage('002'));
    invariant(isObject(context), getMessage('004'));
    startRecode(func);
    func.call(context || G);
    endRecode(func);
  };

  function computed(input, key, descriptor) {
    var args = arguments;
    var input;
    var key;
    var descriptor;

    if (args.length === 3) {
      input = args[0];
      key = args[1];
      descriptor = args[2];
      invariant(isString(key), getMessage('003'));

      if (isDescriptor(descriptor)) {
        if (!(CONST.KLASS_COMPUTED in input)) {
          defValue(input, CONST.KLASS_COMPUTED, []);
        }
        input[CONST.KLASS_COMPUTED].push(key);
        return;
      }
      return;
    }
    
  };

  return {
    observable: observable,
    autorun: autorun,
    computed: computed,
  };
});