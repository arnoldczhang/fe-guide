/**
 * 组合
 *
 * TODO
 * 
 * @param  {[type]} combinateOptions [description]
 * @param  {[type]} combinateLength  [description]
 * @return {[type]}                  [description]
 */
function combinationWithRepetitions(
  combinateOptions,
  combinateLength = combinateOptions.length
) {
  if (combinateLength === 1) {
    return combinateOptions.map(item => [ item ]);
  }

  const result = [];

  const smallerPermutations = combinationWithRepetitions(
    combinateOptions,
    combinateLength - 1,
  );

  combinateOptions.forEach((currentOption, outerI) => {
    smallerPermutations.forEach((smallerPermutation, innerI) => {
      if (!outerI || (innerI >= outerI && ((innerI - outerI) / combinateOptions.length) % 1)) {
        result.push([currentOption].concat(smallerPermutation));
      } else {
        result.push([]);
      }
    });
  });
  return result;
};

// test
debugger;
console.log(combinationWithRepetitions([1, 2, 3]));