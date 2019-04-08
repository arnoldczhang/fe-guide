// 假快排（分组-》分组-》分组）
function fastSort(list) {
  var length = list.length;
  var max;
  var left = [];
  var right = [];
  var item;

  if (length <= 1) {
    return list;
  }

  max = list[0];
  for (var i = 1; i < length; i += 1) {
    item = list[i];
    if (item > max) {
      right[right.length] = item;
    } else {
      left[left.length] = item;
    }
  }
  return fastSort(left).concat(max).concat(fastSort(right));
};

// 真快排（分组-》排序-》分组）
function quickSort(unsorted) {
  function partition(array, left, right) {
    const pivot = array[ Math.floor((left + right) / 2) ];

    while (left <= right) {
      while (array[left] < pivot) {
        left++;
      }

      while (array[right] > pivot) {
        right--;
      }

      if (left <= right) {
        [array[left], array[right]] = [array[right], array[left]];
        left++;
        right--;
      }
    }

    return left;
  }

  function quick(array, left, right) {
    if (array.length <= 1) {
      return array;
    }

    const index = partition(array, left, right);

    if (left < index - 1) {
      quick(array, left, index - 1);
    }

    if (right > index) {
      quick(array, index, right);
    }

    return array;
  }

  return quick(unsorted, 0, unsorted.length - 1);
};