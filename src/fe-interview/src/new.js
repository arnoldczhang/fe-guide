function A(word) {
  this.word = word;
};

A.sayWord = function(instance) {
  console.log(instance.getWord());
};

A.prototype = {
  getWord() {
    return this.word;
  },
};

// new1
function neW(Klass) {
  if (Klass instanceof Function) {
    if (typeof Klass.prototype === 'object') {
      const instance = Object.create(Klass.prototype);
    }
    const args = [].slice.call(arguments, 1);
    Klass.apply(instance, args);
    return instance;
  }
};

// new2
function neW2(Construtor, ...args) {
  if (typeof Construtor === 'function') {
    var obj = {};
    obj.__proto__ = Construtor.prototype;
    const result = Construtor.apply(obj, args);
    return typeof result === 'object' ? result : obj;
  }
  throw new Error(`${Construtor} is not a constructor`);
};

// test
// const a = neW(A, 'abc');
