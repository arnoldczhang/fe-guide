/**
 * 排列（可重复）
 * @param  {[type]} permutationOptions [description]
 * @param  {[type]} permutationLength  [description]
 * @param  {[type]}                    [description]
 * @return {[type]}                    [description]
 */
function permutateWithRepetitions(
  permutationOptions,
  permutationLength = permutationOptions.length,
) {
  if (permutationLength === 1) {
    return permutationOptions.map(
      permutationOption => [ permutationOption ]
    );
  }

  const permutations = [];

  const smallerPermutations = permutateWithRepetitions(
    permutationOptions,
    permutationLength - 1,
  );

  permutationOptions.forEach((currentOption) => {
    smallerPermutations.forEach((smallerPermutation) => {
      permutations.push([currentOption].concat(smallerPermutation));
    });
  });

  return permutations;
};

// test
// console.log(permutateWithRepetitions([1, 2, 3]));

/**
 * 排列（不可重复）
 * @param  {[type]} permutationOptions [description]
 * @param  {[type]} permutationLength  [description]
 * @param  {[type]}                    [description]
 * @return {[type]}                    [description]
 */
function permutateWithoutRepetitions(
  permutationOptions,
  permutationLength = permutationOptions.length,
) {
  if (permutationLength === 1) {
    return permutationOptions.map(
      permutationOption => [ permutationOption ]
    );
  }

  const permutations = [];

  const smallerPermutations = permutateWithoutRepetitions(
    permutationOptions,
    permutationLength - 1,
  );

  permutationOptions.forEach((currentOption) => {
    smallerPermutations.forEach((smallerPermutation) => {
      if (smallerPermutation.indexOf(currentOption) === -1) {
        permutations.push([currentOption].concat(smallerPermutation));
      }
    });
  });

  return permutations;
};

// test
// console.log(permutateWithoutRepetitions([1, 2, 3]));
