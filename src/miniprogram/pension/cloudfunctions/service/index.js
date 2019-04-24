const cloud = require('wx-server-sdk');
cloud.init();
const { getInitData, CRUDMap } = require('./dao')(cloud.database());
const { decode } = require('./utils');

exports.main = async (event, context) => {
  const { method, collection, condition, ...data } = event;
  let result = getInitData();
  if (method) {
    try {
      result.data = await CRUDMap[method](collection, data, condition);
    } catch({ message }) {
      result.code = 1;
      result.message = message;
    }
  }
  return result;
};
