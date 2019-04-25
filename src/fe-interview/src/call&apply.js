
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
  const result = context.fn(...resArgs);
  delete context.fn;
  return result;
};

// Function.prototype.apply
Function.prototype.apply2 = function(context = window) {
  const restArgs = arguments[1] || [];
  context.fn = this;
  const result = context.fn(...resArgs);
  delete context.fn;
  return result;
};

// Function.prototype.bind
Function.prototype.bind2 = function(context = window) {
  if (typeof this === 'function') {
    const restArgs = [...arguments].slice(1);
    context.fn = this;
    context.rest = function rest(...args) {
      const result = context.fn(...restArgs.concat(args));
      delete context.fn;
      delete context.rest;
      return result;
    };
    return context.rest;
  }
};

// test
// function aa(a, b, c) {return a + b + c;};
// var bb = aa.bind2({}, 1, 2);
// console.log(bb(3));
