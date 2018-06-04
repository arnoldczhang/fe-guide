const xlsx = require('node-xlsx');
const fs = require('fs');
const AV = require('leancloud-storage');
require('leancloud-realtime');
const {
  FUNC,
} = require('./utils');

const {
  DB: {
    appid,
    appkey,
  },
  STATUS: {
    DOING,
    DONE,
    ENGAGED,
  },
  TYPE: {
    BORROW,
    DONATE,
  },
  ADMIN,
} = require('./const');
const isAdmin = openid => ADMIN.indexOf(openid) > -1;
const User = AV.Object.extend('user');
const Book = AV.Object.extend('book');
const Logger = AV.Object.extend('log');
const Fortune = AV.Object.extend('fortune');

AV.init({
  appId: appid,
  appKey: appkey,
});

const userCheck = (data, next = FUNC) => {
  return new Promise((resolve, reject) => {
    const query = new AV.Query('user');
    query.equalTo('openid', data.openid);
    userQuery.find().then((res) => {
      if (!res.length) {
        return reject('当前用户非注册用户');
      }
      resolve();
    });
  });
};

const nextCheck = (checks, data, cb, fb) => {
  let check;
  if (check = checks.shift()) {
    check(data).then(() => {
      if (checks.length) {
        return nextCheck(checks, data, cb, fb);
      }
      return cb();
    }).catch(fb);
  }
};

const checkAuth = (...checks) => (data, cb, fb) => {
  return nextCheck(checks, data, cb, fb);
};

const auth = checkAuth(userCheck);

const log = (data = {}) => {
  const logger = new Logger();
  logger.save(data).then(() => {
    console.log(`log success!`);
  });
};

const validateWrap = (cb = FUNC) => (express, message, dao) => {
  if (!express) {
    cb({
      message,
      dao,
    });
  }
};

const validate = validateWrap(log);

/**
 * 登陆
 * @param  {[type]}   data     [description]
 * @param  {Function} callback [description]
 * @param  {[type]}   fallback [description]
 * @return {[type]}            [description]
 */
const addUser = (data = {}, callback = FUNC, fallback = FUNC) => {
  let user;
  const query = new AV.Query('user');
  validate(data.openid, 'openid不可为空', 'addUser');
  query.equalTo('openid', data.openid);
  query.find().then((res) => {
    let user = res[0];
    if (!user) user = new User();
    user.save(data).then(() => {
      console.log(`save openid: ${data.openid} success!`);
      callback({
        isAdmin: isAdmin(data.openid),
      });
    });
  }).catch((err) => {
    console.log(`save openid: ${data.openid} fail!`);
    fallback();
  });
};

/**
 * 新增星座
 * @param  {[type]}   data     [description]
 * @param  {Function} callback [description]
 * @param  {[type]}   fallback [description]
 * @return {[type]}            [description]
 */
const addFortune = (data, callback = FUNC, fallback = FUNC) => {
  const fortuneExcel = xlsx.parse(`${__dirname}/ft.xls`);
  const fortuneData = fortuneExcel[0].data;
  const fortuneKeyArray = fortuneData.shift();
  fortuneData.forEach((fort) => {
    const fortune = new Fortune();
    fortune.save(fort.reduce((res, value, index) => {
      res[fortuneKeyArray[index]] = value;
      return res;
    }, {}));
  });
  callback({});
};

const getFortune = (data, callback = FUNC, fallback = FUNC) => {
};

/**
 * 借书
 * @param  {[type]}   data     [description]
 * @param  {Function} callback [description]
 * @param  {[type]}   fallback [description]
 * @return {[type]}            [description]
 */
const borrowBook = (data = {}, callback = FUNC, fallback = FUNC) => {
  const query = new AV.Query('book');
  validate(data.to, 'openid不可为空', 'borrowBook');
  validate(data.isbn, `${data.to}: isbn不可为空`, 'borrowBook');
  query.equalTo('isbn', data.isbn);
  query.find().then((res) => {
    let book = res[0];
    if (!book) {
      console.log(`does not existed!`);
      fallback('该书不在库中');
      return;
    }

    if (book.attributes.status != DONE) {
      console.log(`is in process!`);
      fallback('该书正在处理中');
      return;
    }

    data.from = book.attributes.from || '';
    data.status = DOING;

    if (data.from && data.from === data.to) {
      console.log(`can't borrow from the same donator!`);
      fallback('借书人和捐书人不能是同一人');
    } else {
      book.save(data).then(() => {
        console.log(`borrow book: ${data.isbn} success!`);
        callback(data);
      });
    }
  }).catch((err) => {
    console.log(`borrow book: ${data.isbn} fail!`);
    fallback();
  });
};

/**
 * 捐书
 * @param  {[type]}   data     [description]
 * @param  {Function} callback [description]
 * @param  {[type]}   fallback [description]
 * @return {[type]}            [description]
 */
const donateBook = (data = {}, callback = FUNC, fallback = FUNC) => {
  const query = new AV.Query('book');
  validate(data.from, 'openid不可为空', 'donateBook');
  validate(data.isbn, `${data.from}: isbn不可为空`, 'donateBook');
  query.equalTo('isbn', data.isbn);
  query.find().then((res) => {
    let book = res[0];
    if (!book) {
      book = new Book();
    } else {
      console.log(`the book is existed!`);
      fallback('该书已存在，不必重复捐献咯');
      return;
    }

    data.to = '';
    data.status = DOING;

    book.save(data).then(() => {
      console.log(`donate book: ${data.isbn} success!`);
      callback(data);
    });
  }).catch((err) => {
    console.log(`donate book: ${data.isbn} fail!`);
    fallback();
  });
};

/**
 * 还书
 * @param  {[type]}   data     [description]
 * @param  {Function} callback [description]
 * @param  {[type]}   fallback [description]
 * @return {[type]}            [description]
 */
const returnBook = (data = {}, callback = FUNC, fallback = FUNC) => {
  const query = new AV.Query('book');
  validate(data.openid, 'openid不可为空', 'returnBook');
  if (!isAdmin(data.openid)) {
    console.log(`is not admin!`);
    fallback('你不是管理员');
    validate(data.openid, `${data.openid}不是管理员`, 'returnBook');
    return;
  }
  validate(data.isbn, `${data.openid}还书异常`, 'returnBook');
  query.equalTo('isbn', data.isbn);
  query.find().then((res) => {
    let book = res[0];
    if (!book) {
      console.log(`does not existed!`);
      fallback('该书不在库中');
      validate(book, `${data.openid}书不在库中`, 'returnBook');
      return;
    }

    if (!book.attributes.to) {
      console.log(`does not need return!`);
      fallback('该书未被借走，无需还书');
      validate(book.attributes.to, `${data.openid}无需还书`, 'returnBook');
      return;
    }

    book.save({
      status: DONE,
      to: '',
    }).then(() => {
      console.log(`return book: ${data.isbn} success!`);
      callback(data);
    });
  }).catch((err) => {
    console.log(`return book: ${data.isbn} fail!`);
    fallback();
  });
};

/**
 * 捐书/借书列表
 * @param  {[type]}   data     [description]
 * @param  {Function} callback [description]
 * @param  {[type]}   fallback [description]
 * @return {[type]}            [description]
 */
const getBooklist = (data = {}, callback = FUNC, fallback = FUNC) => {
  const query = new AV.Query('book');
  validate(data.openid, 'openid不可为空', 'getBooklist');
  if (data.type === BORROW) {
    query.equalTo('to', data.openid);
  } else {
    query.equalTo('from', data.openid);
  }
  query.find().then((res) => {
    console.log(`${data.openid}get booklist success!`);
    res.map((item) => {
      const attr = item.attributes;
      if (attr.status === DONE) {
        attr.done = true;
        attr.status = `${attr.region}${attr.status}`;
      }
      return item;
    })
    callback({ list: res });
  }).catch((err) => {
    console.log(`${data.openid}get booklist fail!`);
    fallback();
  });
};

/**
 * 待审批列表
 * @param  {[type]}   data     [description]
 * @param  {Function} callback [description]
 * @param  {[type]}   fallback [description]
 * @return {[type]}            [description]
 */
const getApproveList = (data = {}, callback = FUNC, fallback = FUNC) => {
  const query = new AV.Query('book');
  validate(data.openid, 'openid不可为空', 'getApproveList');
  if (!isAdmin(data.openid)) {
    console.log(`is not admin!`);
    fallback('你不是管理员');
    validate(data.openid, `${data.openid}不是管理员`, 'getApproveList');
    return;
  }
  query.equalTo('status', DOING);
  query.find().then((res) => {
    console.log(`${data.openid} get approve booklist success!`);
    callback({ list: res });
  }).catch((err) => {
    console.log(`${data.openid}get booklist fail!`);
    fallback();
  });
};

/**
 * 审批
 * @param  {[type]}   data     [description]
 * @param  {Function} callback [description]
 * @param  {[type]}   fallback [description]
 * @return {[type]}            [description]
 */
const approve = (data = {}, callback = FUNC, fallback = FUNC) => {
  const query = new AV.Query('book');
  validate(data.openid, 'openid不可为空', 'approve');
  if (!isAdmin(data.openid)) {
    console.log(`is not admin!`);
    fallback('你不是管理员');
    validate(data.openid, `${data.openid}不是管理员`, 'approve');
    return;
  }
  query.equalTo('isbn', data.id);
  query.find().then((res) => {
    let book = res[0];
    if (!book) {
      console.log(`does not existed!`);
      fallback('该书不在库中');
      validate(book, `${data.openid}书不在库中`, 'approve');
      return;
    }

    book.save({
      status: book.attributes.to ? ENGAGED : DONE,
    }).then(() => {
      console.log(`approve book: ${data.id} success!`);
      callback(book.attributes);
    });
    console.log(`book: ${data.id} is found!`);
  }).catch((err) => {
    console.log(`${data.openid}get booklist fail!`);
    fallback();
  });
};

/**
 * 捐书榜单
 * @param  {Object}   data     [description]
 * @param  {Function} callback [description]
 * @param  {[type]}   fallback [description]
 * @return {[type]}            [description]
 */
const rank = (data = {}, callback = FUNC, fallback = FUNC) => {
  const bookQuery = new AV.Query('book');
  validate(data.openid, 'openid不可为空', 'rank');

  const userQuery = new AV.Query('user');
  userQuery.equalTo('openid', data.openid);
  userQuery.find().then((uRes) => {
    if (!uRes.length) {
      console.log(`${data.openid} is not in user table!`);
      fallback('当前用户非注册用户');
      return;
    }
    bookQuery.find().then((res) => {
      const bookMap = {};
      res.forEach((book) => {
        const {
          attributes: {
            from,
          },
        } = book;
        bookMap[from] = bookMap[from] || 0;
        bookMap[from] += 1;
      });

      const reStr = Object.keys(bookMap).reduce((result, key) => {
        result += `${key}|`;
        return result;
      }, '^(?:');
      const re = new RegExp(`${reStr.substring(0, reStr.length - 1)})$`);

      const userAllQuery = new AV.Query('user');
      userAllQuery.matches('openid', re);
      userAllQuery.find().then((matchRes) => {
        const ranklist = [];
        matchRes.forEach((user) => {
          const {
            attributes: {
              openid,
              nickName,
              avatarUrl,
            },
          } = user;

          ranklist.push({
            count: bookMap[openid],
            nickName,
            avatarUrl,
          });
        });
        callback(ranklist.sort((a, b) => (b.count - a.count)));
      });
    }).catch((err) => {
      console.log(`${data.openid}get booklist fail!`);
      fallback('网络异常');
    });
  });
};

module.exports = {
  addUser,
  borrowBook,
  donateBook,
  returnBook,
  getBooklist,
  approve,
  getApproveList,
  rank,

  addFortune,
  getFortune,
};
