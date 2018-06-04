/**
 * utils
 * @param  {...[type]} args [description]
 * @return {[type]}         [description]
 */
const querystring = require('querystring');
const response = require('./response');
const api = require('./controller');

const FUNC = v => v;
const extend = (...args) => Object.assign.apply(null, args);
const isUndefined = obj => typeof obj === 'undefined';
const getQuery = (url = '') => {
  const search = url.split('?')[1];
  return querystring.parse(search);
};
const getHash = () => {
  const code = +String(Math.random()).substr(2);
  return code.toString(36);
};
const abstractApi = key => (ctx) => {
  const {
    body,
    url,
  } = ctx.request;
  let query = getQuery(ctx.request.url);
  // if (typeof body === 'object') {
  //   query = body;
  // }
  return api[key](ctx, query, (res) => {
    ctx.body = extend({}, response, res);
  }, (err) => {
    ctx.body = extend({}, response, err);
  });
};

module.exports = {
  FUNC,
  getHash,
  extend,
  isUndefined,
  getQuery,
  abstractApi,
};