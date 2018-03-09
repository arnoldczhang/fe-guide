async function foo() {
  return new Promise((resolve, reject) => {
    resolve(1);
  });
};

const result = await foo();
console.log(result);