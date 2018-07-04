import { isFunction } from '../src/utils';

export default (...args) => {
  let callback;
  let argsLength = args.length;

  if (argsLength) {
    callback = args.pop();
    if (isFunction(callback)) {
      if (argsLength > 1) {
        return (state) => {
          return callback.apply(state, args.reduce((result, selector) => {
            result.push(selector(state));
            return result;
          }, []));
        };
      }
      return (state) => {
        return callback.call(state, state);
      };
    } else {
      // TODO
    }
  } else {
    // TODO
  }
};
