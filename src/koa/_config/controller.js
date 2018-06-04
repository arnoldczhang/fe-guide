const request = require('request');
const querystring = require('querystring');
const db = require('./leancloud');
const {
  FUNC,
  extend,
} = require('./utils');
const {
  WX: {
    appid,
    secret,
  },
  CODE,
  MSG,
} = require('./const');

async function addUser(ctx, data, callback = FUNC) {
  const {
    code = '',
  } = data;

  return new Promise((resolve, reject) => {
    request({
      url: 'https://api.weixin.qq.com/sns/jscode2session',
      json: true,
      qs: {
        appid,
        secret,
        js_code: code,
        grant_type: 'authorization_code',
      },
    }, (error, response, body) => {
      if (!error && response.statusCode == 200) {
        if (body.errcode) {
          callback({
            code: CODE.AUTHFAIL,
            message: MSG.AUTHFAIL,
          });
          resolve();
        } else {
          db.addUser({
            ...data,
            ...body,
          }, (res) => {
            callback({
              code: CODE.SUCCESS,
              data: {
                ...body,
                ...res,
              },
            });
            resolve();
          }, () => {
            callback({
              code: CODE.AUTHFAIL,
              message: MSG.AUTHFAIL,
            });
            resolve();
          });
        }
      } else {
        callback({
          code: CODE.FAIL,
          message: MSG.REQFAIL,
        });
        reject();
      }
    });
  });
};

async function getFortune(ctx, data, callback = FUNC) {
  db.getFortune(data, (fortune) => {
    ctx.body = JSON.stringify(fortune);
  });
};

const abstractController = key => async function(ctx, data, callback = FUNC) {
  return new Promise((resolve, reject) => {
    db[key]({
      ...data,
    }, (resBody) => {
      callback({
        code: CODE.SUCCESS,
        data: !Array.isArray(resBody) ? {
          ...resBody,
        } : resBody,
      });
      resolve();
    }, (msg) => {
      callback({
        code: CODE.FAIL,
        message: msg || MSG.ACTFAIL,
      });
      resolve();
    });
  });
};

module.exports = {
  addUser,
  getFortune,
  borrowBook: abstractController('borrowBook'),
  donateBook: abstractController('donateBook'),
  returnBook: abstractController('returnBook'),
  getBooklist: abstractController('getBooklist'),
  approve: abstractController('approve'),
  getApproveList: abstractController('getApproveList'),
  rank: abstractController('rank'),
};
