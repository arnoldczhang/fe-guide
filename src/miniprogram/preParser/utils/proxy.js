function $$myProxyFn(fn, _this, key) {
  const returnValue = function $$myProxyFn$$(...args) {
    args = args.map((arg) => {
      if (arg && typeof arg === 'object') {
        Object.keys(arg).forEach((key) => {
          if (typeof arg[key] === 'function') {
            arg[key] = arg[key].toString();
          }
        });
      }
      return arg;
    });
    let result;
    try {
      result = fn.apply(this, args);
      console.log(
        'api-method-called',
        `my.${key}`,
        JSON.stringify(args),
        result && typeof result === 'object' ? JSON.stringify(result) : result,
      );
    } catch (err) {
      console.log(
        'api-error-method-called',
        `my.${key}`,
        JSON.stringify(args),
      );
    } finally {
      return result;
    }
  }.bind(_this);

  Object.keys(fn).forEach((k) => {
    const fnValue = fn[k];
    if (typeof fnValue === 'function') {
      returnValue[k] = $$myProxyFn(fnValue, fn, k);
    } else {
      returnValue[k] = fnValue;
    }
  });
  return returnValue;
};

const $$myProxy = (_this) => {
  return new Proxy(_this, {
    get(target, key) {
      const keyValue = target[key];
      if (typeof keyValue === 'function') {
        return $$myProxyFn(keyValue, target, key);
      }

      // cjs默认exports不上报
      if (key !== 'default') {
        console.log('api-attr-called', `my.${key}`);
      }
      return keyValue;
    }
  });
};

window.$$myProxy = $$myProxy;
window.$$myProxyFn = $$myProxyFn;