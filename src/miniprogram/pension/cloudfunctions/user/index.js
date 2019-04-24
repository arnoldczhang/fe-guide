const cloud = require('wx-server-sdk');

cloud.init();

const getBaseInfo = () => {
  const wxContext = cloud.getWXContext();
  const {
    OPENID: openid,
    APPID: appid,
    UNIONID: unionid,
  } = wxContext;
  return {
    openid,
    appid,
    unionid,
  };
};

const createUser = async (event, context) => {
  const { method, condition, ...userInfo } = event;
  const {
    openid,
    appid,
    unionid,
  } = getBaseInfo();
  const result = await cloud.callFunction({
    name: 'service',
    data: {
      // 通用参数
      collection: 'user',
      method,
      condition,
      // 传参
      openid,
      appid,
      unionid,
      ...userInfo,
    },
  });
  return result;
};

const updateUser = async (event, context) => {
  const {
    openid,
  } = getBaseInfo();
  event.condition = {
    openid,
  };
  const { result } = await getUser(event, context);
  // 如果不存在，新增用户
  if (!(result.data && result.data.data.length)) {
    event.method = 'post';
  }
  return await createUser(event, context);
};

const getUser = async (event, context) => {
  const {
    openid,
  } = getBaseInfo();
  const { method } = event;
  const result = await cloud.callFunction({
    name: 'service',
    data: {
      collection: 'user',
      method: 'get',
      condition: {
        openid,
      },
    },
  });
  return result;
};

exports.main = async (event, context) => {
  const { method = 'post' } = event;
  let result = {};
  switch(method.toUpperCase()) {
    case 'POST':
      result = await createUser(event, context);
      break;
    case 'GET':
      result = await getUser(event, context);
      break;
    case 'PUT':
      result = await updateUser(event, context);
      break;
    case 'DELETE':
      break;
    default:
      break;
  }
  return result.result;
};
