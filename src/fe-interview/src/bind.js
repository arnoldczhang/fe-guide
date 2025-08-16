Function.prototype._bind = function bind(context, ...defaultArgs) {
  const oldFunction = this;
  return function BindFunction(...activeArgs) {
    const args = defaultArgs.concat(activeArgs);
    // 如果是实例化，不用变更this指向
    if (this instanceof BindFunction) {
      return new oldFunction(...args);
    }
    return oldFunction.call(context, ...args);
  }
}

// test
function aa(a, b) {
  console.log(this, a, b);
}

var aab = aa._bind({ c: 123 }, 5);

// aab(6);
// new aab(6);