const mongo = require('./mongo');
const noop = val => val;

async function addUser(data = {}, cb = noop) {
  return new Promise((resolve, reject) => {
    return mongo.connect((db) => {
      return mongo.insertOrUpdateOne(db, 'user', { openid: data.openid }, data, (res) => {
        cb(res);
        resolve();
      });
    });
  });
};

const getUser = (data = {}, cb = noop) => {
  return new Promise((resolve, reject) => {
    return mongo.connect((db) => {
      return mongo.findOne(db, 'user', data, (res) => {
        cb(res);
        resolve();
      });
    });
  });
};

module.exports.addUser = addUser;
module.exports.getUser = getUser;