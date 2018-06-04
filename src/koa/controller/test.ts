import * as Koa from 'koa';
import {
  abstractService,
  extend,
} from '../utils';

async function getInfo(data: Object) {
  const o1 = await abstractService('getInfoBef', data);
  const o2 = await abstractService('getInfoAft', data);
  const code = o1.code || o2.code || 0;
  return extend({}, {
    data: {
      o1: o1.data || {},
      o2: o2.data || {},
    },
    code,
  });
};

export default {
  getInfo,
}