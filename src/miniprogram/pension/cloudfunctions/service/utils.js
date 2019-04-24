const crypto = require('crypto');
const appsecret = '11591ffd8d183633e85e591c8fa1d3cf';

const decode = (session_key, encrypted_data, iv) => {
  const sessionKey = new Buffer(session_key, 'base64');
  const encryptedData = new Buffer(encrypted_data, 'base64');
  iv = new Buffer(iv, 'base64');
  const decipher = crypto.createDecipheriv('aes-128-cbc', sessionKey, iv);
  // 设置自动 padding 为 true，删除填充补位
  decipher.setAutoPadding(true);
  let decoded = decipher.update(encryptedData, 'binary', 'utf8');
  decoded += decipher.final('utf8');
  decoded = JSON.parse(decoded);
};
const encode = () => {};

module.exports = {
  decode,
  encode,
};