// 解法1
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


