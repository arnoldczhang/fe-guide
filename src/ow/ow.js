/**
 * 校验schema
 */
const ow = require('ow');
const unicorn = input => {
  ow(input, ow.string.minLength(5));
};
// unicorn('12');
// unicorn('a');