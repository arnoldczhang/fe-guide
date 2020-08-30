function asyncToGenerator(generatorFn) {
  return function async(...args) {
    const generator = generatorFn.apply(this, args);
    return new Promise((resolve, reject) => {
      function step(action, arg) {
        let result;
        try {
          result = generator[action](arg);
        } catch (err) {
          reject(err);
        }
        const { value, done } = result;

        if (done) {
          return resolve(value);
        }
        return Promise.resolve(value).then(
          res => step('next', res),
          err => step('throw', err),
        );
      }
      step('next');
    });
  }
}

function * gen() {
  yield 1;
  yield 2;
  yield 3;
}

const result = asyncToGenerator(gen);

debugger;
result().then((res) => {
  console.log(res);
})