
/**
 * 洗牌算法
 * @param  {[type]} originalArray [description]
 * @return {[type]}               [description]
 */
const fisherYates = (originalArray) => {
  const array = originalArray.slice(0);

  for (let i = array.length - 1; i > 0; i -= 1) {
    const randomIndex = Math.floor(Math.random() * (i + 1));
    [ array[i], array[randomIndex] ] = [ array[randomIndex], array[i] ];
  }
  return array;
};