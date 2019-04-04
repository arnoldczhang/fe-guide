
/**
 * 杨辉三角
 * 
 * @param  {[type]} line [description]
 * @return {[type]}      [description]
 *
 *  概念
 *
 *  C(lineNumber, i)   = lineNumber! / ((lineNumber - i)! * i!)
 *  C(lineNumber, i - 1) = lineNumber! / ((lineNumber - i + 1)! * (i - 1)!)
 *
 * =>
 *
 *  C(lineNumber, i) = C(lineNumber, i - 1) * (lineNumber - i + 1) / i
 * 
 */
function pascalTriangle(line) {
  const length = line;
  const result = [1];
  for (let i = 1; i <= length; i += 1) {
    result[i] = result[i - 1] * (line - i + 1) / i;
  }
  return result;
};

// test
// console.log(pascalTriangle(1));
// console.log(pascalTriangle(2));
// console.log(pascalTriangle(3));
// console.log(pascalTriangle(4));



