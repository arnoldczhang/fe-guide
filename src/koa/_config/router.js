const fs = require('fs');
const ejs = require('ejs');
const router = require('koa-router')();
const build = require('./build');
const renderer = require('./render');
const {
  getHash,
  extend,
  isUndefined,
  abstractApi,
} = require('./utils');

let compiler;

async function index(ctx) {
  ctx.body = 'hello world';
};

async function addUser (ctx) {
  await abstractApi('addUser')(ctx);
};

async function borrowBook (ctx) {
  await abstractApi('borrowBook')(ctx);
};

async function donateBook (ctx) {
  await abstractApi('donateBook')(ctx);
};

async function returnBook (ctx) {
  await abstractApi('returnBook')(ctx);
};

async function getApproveList (ctx) {
  await abstractApi('getApproveList')(ctx);
};

async function approve (ctx) {
  await abstractApi('approve')(ctx);
};

async function getBooklist (ctx) {
  await abstractApi('getBooklist')(ctx);
};

async function getFortune(ctx) {
  await abstractApi('getFortune')(ctx);
};

async function rank(ctx) {
  await abstractApi('rank')(ctx);
};

/*
  Router
 */
router
  .get('/', index)
  // 登陆
  .get('/login', addUser)
  .get('/addUser', addUser)
  // 借书
  .get('/borrow', borrowBook)
  // 捐书
  .get('/donate', donateBook)
  // 还书
  .get('/return', returnBook)
  // 审批
  .get('/approve', approve)
  .get('/approvelist', getApproveList)
  // 借书/捐书列表
  .get('/booklist', getBooklist)
  // 捐书排行榜
  .get('/rank', rank)
  .get('/getFortune', getFortune)
  ;

module.exports = router;