/**
 * 题目：
 * 
 * 1234.12 -> 1,234.12
 * 
 */
function format(number) {
  return number.toString().replace(/(\d{1,2})(?=(\d{3})+(\.\d{1,2})?$)/g, '$1, ');
}