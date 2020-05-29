
/**
 * 
 * 总体思路
 * 
 * - 将函数设为对象的属性
 * - 执行&删除这个函数
 * - 指定this到函数并传入给定参数执行函数
 * - 如果不传入参数，默认指向为 window
 * 
 */

// Function.prototype.call
Function.prototype.call2 = function(context = window) {
  const restArgs = [...arguments].slice(1);
  context.fn = this;
  const result = context.fn(...restArgs);
  delete context.fn;
  return result;
};

// Function.prototype.apply
Function.prototype.apply2 = function(context = window) {
  const restArgs = arguments[1] || [];
  context.fn = this;
  const result = context.fn(...restArgs);
  delete context.fn;
  return result;
};

// Function.prototype.bind
Function.prototype.bind2 = function(thisObj = window) {
  if (typeof this !== 'function') {
    throw new Error('Function.prototype.bind - what is trying to be bound is not callable');
  }
  const fn = this;
  thisObj = thisObj || window;
  const args = [].slice.call(arguments, 1);
  function fnn() {
    return fn.apply(this instanceof fnn ? this : thisObj, args.concat(...arguments));
  };
  // bind后的新函数，如果做实例化，this还是指向原函数
  function fo(){};
  fo.prototype = fn.prototype;
  fnn.prototype = new fo;
  return fnn;
};

// test
// function aa(a, b, c) {return a + b + c;};
// var bb = aa.bind2({}, 1, 2);
// console.log(bb(3));
