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

// test
// const a = neW(A, 'abc');
