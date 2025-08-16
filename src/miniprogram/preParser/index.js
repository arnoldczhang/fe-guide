const { TYPE } = require('./const');

function preParser(
  config = {},
) {
  const {
    type = TYPE.alipay,
    ...otherConfig
  } = config;

  switch(type) {
    case TYPE.alipay:
      require('./parser/alipay')(otherConfig);
      break;
    case TYPE.wx:
      console.warn('暂不支持');
      break;
    default:
      break;
  }
}

module.exports = preParser;
