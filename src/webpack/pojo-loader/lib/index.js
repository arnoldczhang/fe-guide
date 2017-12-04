'use strict';

const spaceRE = /\s/g;
const lineRE = /[\r\n\s]+/g;
const splitRE = /;/g;
const nameRE = /\/([^\/\.]+).pojo$/;
const scopeRE = /^(public|private)$/i;
const typeRE = /^(array|object|number|string|null|undefined|regexp|boolean|function)$/i;

const checkScope = scope => scopeRE.test(scope);

const checkType = type => typeRE.test(type);

const identity = v => v;

const toSpace = value => value.replace(lineRE, ' ').trim();

const log = (...args) => {
  return Function.prototype.apply.call(
    console.log,
    console.log,
    ['\n', '==========LOG MENU==========', '\n']
      .concat(args)
      .concat('\n', '==========LOG MENU==========')
  );
};

const genRandom = () => {
  return Number(String(Math.random()).substr(2)).toString(36);
};

const capital = (str = '') => {
  const len = str.length;
  if (!len) return '';
  if (len === 1) str.toUpperCase();
  return str[0].toUpperCase() + str.substr(1);
};


const format = (inputs = [], className = `class${genRandom()}`) => {
  const _formatSetter = (arr = []) => {
    const [scope, type, variable] = arr;
    return `
      ${className}.prototype.set${capital(variable)} = function (value) {
        if (Object.prototype.toString.call(value) === '[object ${capital(type)}]') {
          return this.${variable} = value;
        }
        throw new Error('the type of ${variable} must be \`${type}\`');
      };
    `;
  };

  const _formatGetter = (arr = []) => {
    const [scope, type, variable] = arr;
    return `
      ${className}.prototype.get${capital(variable)} = function () {
        ${scope === 'public'
          ? `return this.${variable};`
          : `throw new Error('the value of ${variable} is \`read-only\`');`}
      };
    `;
  };

  return inputs.reduce((res, value) => {
    const declareArr = value.split(spaceRE);
    const declareLen = declareArr.length;
    if (declareLen === 1) declareArr.unshift('public', '');
    if (declareLen === 2) {
      if (scopeRE.test(declareArr[0])) {
        declareArr.splice(1, 0, '');
      }

      else {
        declareArr.unshift('public');
      }
    }
    const [scope, type, variable] = declareArr;

    if (!checkScope(scope)) {
      throw new Error(`the scope of ${variable} is wrong, not ${scope}`);
    }

    if (!checkType(type)) {
      throw new Error(`${variable} need an appropriate type, not ${type}.`);
    }
    res.push(_formatGetter(declareArr), _formatSetter(declareArr));
    return res;
  }, []);
};

module.exports = {
  lineRE,
  splitRE,
  nameRE,
  identity,
  toSpace,
  log,
  genRandom,
  capital,
  format,
};
