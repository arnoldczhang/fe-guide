enum CODE {
  SUCCESS,
  FAIL,
  NOLOGIN,
};

const LEANCLOUD = {
  appId: 'Hi5TPuhSy43kOGEbKVDHsyF9-gzGzoHsz',
  appKey: 'ii8n2CqtDQjyRnOd4ModaN63',
};

const MSG = {
  ACTFAIL: 'operation is fail',
};

function FUNC<T>(value: T): T{
  return value;
};

export {
  CODE,
  MSG,
  LEANCLOUD,
  FUNC,
};