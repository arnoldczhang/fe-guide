async function cube(x) {
  await Promise.resolve(x * x * x);
}

async function square(x) {
  await Promise.resolve(x * x);
}


export {
  cube,
  square,
};
