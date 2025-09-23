const flatten = (arr) => {
  return arr.reduce((res, pre) => {
    if (Array.isArray(pre)) {
      res.push(...flatten(pre));
    } else {
      res.push(pre);
    }
    return res;
  }, []);
};

// test
let nestedArray = [1, [2, [3, [4]], 5]];
console.log(flatten(nestedArray));
console.log(nestedArray.flat(Infinity));