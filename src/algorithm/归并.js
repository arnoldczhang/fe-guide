function mergeSort(arr) {
  function merge(left, right) {
    let leftIndex = 0;
    let rightIndex = 0;
    const leftLength = left.length;
    const rightLength = right.length;
    const result = [];

    if (leftLength > 0 && rightLength > 0) {
      while (leftIndex < leftLength && rightIndex < rightLength) {
        if (left[leftIndex] < right[rightIndex]) {
          result.push(left[leftIndex++]);
        } else {
          result.push(right[rightIndex++]);
        }
      }
    }

    while (leftIndex < leftLength) {
      result.push(left[leftIndex++]);
    }

    while (rightIndex < rightLength) {
      result.push(right[rightIndex++]);
    }
    return result;
  };

  function split(list) {
    const length = list.length;
    if (length <= 1) {
      return list;
    }
    const mid = Math.floor(length / 2);
    return merge(split(list.slice(0, mid)), split(list.slice(mid)));
  };

  return split(arr);
};
