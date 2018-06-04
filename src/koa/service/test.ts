import * as Koa from 'koa';
import {
  abstractService,
  FUNC,
} from '../utils';

async function getInfoBef(data: Object, resolve = FUNC, reject = FUNC) {
  resolve({});
};

async function getInfoAft(data: Object, resolve = FUNC, reject = FUNC) {
  reject({
    message: 'a',
  });
};


export default {
  getInfoBef,
  getInfoAft,
}