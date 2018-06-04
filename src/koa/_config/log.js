const colors = require('colors');
const message = {
  mongoInit: `mongodb is started`,
  insertOne: (data) => `INSERT-ONE SUCCESS: ${JSON.stringify(data)}`,
  findOne: (data) => `FIND-ONE SUCCESS: ${JSON.stringify(data)}`,
  findOneIng: (data) => `FIND-ONE-ING: ${JSON.stringify(data)}`,
  updateOne: (data) => `UPDATE-ONE SUCCESS: ${JSON.stringify(data)}`,
  collectionNotFound: (data) => `COLLECTION-NOT-FOUND: ${data}`,
};

colors.setTheme({
  help: 'cyan',
  info: 'green',
  data: 'grey',
  warn: 'yellow',
  debug: 'blue',
  error: 'red'
});

module.exports = (messageType, colorType = 'info', data) => {
  if (typeof messageType !== 'string') {
    console.log(message[colorType]);
  }

  else if (data) {
    console.log(message[messageType](data)[colorType]);
  }

  else {
    console.log(message[messageType][colorType]);
  }
};

module.exports.error = (message) => {
  console.log(message.error);
};

module.exports.info = (message) => {
  console.log(message.info);
};