import * as signale from 'signale';

const instance = {
  note: signale.note,
  error: signale.fatal,
  warn: signale.warn,
};

const Logger = {
  getInstance() {
    return instance;
  },
};

export default Logger;
