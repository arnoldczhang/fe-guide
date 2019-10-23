// 解法1：Object.create
function extend(Parent) {
  function F(...args) {
    Parent.apply(this, args);
  };
  F.prototype = Object.create(Parent.prototype, {
    constructor: {
      value: F,
      writable: true,
      configurable: true,
    },
  });
  F.__proto__ = Parent;
  return F;
};

// test
function Klass(word) {
  this.word = word;
};

Klass.sayWord = function(instance) {
  console.log(instance.getWord());
};

Klass.prototype = {
  getWord() {
    return this.word;
  },
};

const ChildKlass = extend(Klass);
const childInstance = new ChildKlass('abc');

console.log(childInstance);
ChildKlass.sayWord(childInstance);


//=============================

// 解法2: 寄生组合式继承
// 1. 创建空函数，修改原型为Parent.prototype，返回实例化结果
// 2. 结果的constructor指向Child
// 3. Child的原型指向实例化结果
function getProto(proto) {
  function F() {};
  F.prototype = proto;
  return new F();
};

function extend2(Child, Parent) {
  const parent = getProto(Parent.prototype);
  parent.constructor = Child;
  Object.setPrototypeOf(Child.prototype, parent);
  Child.__proto__ = Parent;
};

