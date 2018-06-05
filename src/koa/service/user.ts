import * as Koa from 'koa';
import * as AV from 'leancloud-storage';
import 'leancloud-realtime';
import {
  User,
  Log,
  AssetOptions,
} from '../interface';
import {
  extend,
} from '../utils';
import {
  FUNC,
  DB,
} from '../config/constant';

const {
  appId,
  appKey,
} = DB;

const UserKlass: User = AV.Object.extend('user');
const LogKlass: Log = AV.Object.extend('log');

AV.init({
  appId,
  appKey,
});

const trackLog = (log: Log): void => {
  const logInst = new LogKlass();
  logInst.save(log);
};

const createUser = (user?: User, resolve?: Function, reject?: Function): void => {
  const userInst = new UserKlass();
  userInst.save(user).then((): void => {
    resolve(user);
  }).catch((err: Error): void => {
    trackLog({
      message: 'save user error: ${err.message}',
    });
    reject({ err });
  });
};

const getUser = (data?: Object, resolve?: Function, reject?: Function): void => {
  const query = new AV.Query('user');

  Object.keys(data || {}).forEach((key: string): void => {
    query.equalTo(key, data[key]);
  });

  query.find().then((res: Object): void => {
    resolve(res[0]);
  }).catch((err: Error): void => {
    trackLog({
      message: 'get user list error: ${err.message}',
    });
    reject({ err });
  });
};

export const user: AssetOptions =  {
  trackLog,
  createUser,
  getUser,
}