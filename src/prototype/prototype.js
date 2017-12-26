(function () {
  var $define = Object.defineProperty;
  var store = {
    queue: {},
    single: {}
  };

  $define(store, '_set', {
    enumerable: false,
    value: function (map, key, value) {
      store[map][key] = value;
    }
  });

  $define(store, '_get', {
    enumerable: false,
    value: function (map, key) {
      return store[map][key];
    }
  });

  $define(store, 'setQueue', {
    enumerable: false,
    value: function (key, value) {
      return store._set('queue', key, value);
    }
  });

  $define(store, 'getQueue', {
    enumerable: false,
    value: function (key) {
      return store._get('queue', key);
    }
  });

  $define(store, 'setSingle', {
    enumerable: false,
    value: function (key, value) {
      return store._set('single', key, value);
    }
  });

  $define(store, 'getSingle', {
    enumerable: false,
    value: function (key) {
      return store._get('single', key);
    }
  });

  if (Object.freeze) {
    Object.freeze(store);
  }

  function Promise() {

  };

  window.Promise = window.Promise || Promise;
} ());