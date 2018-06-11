import {
  abstractService,
  extend,
} from '../utils';
import {
  User,
  Response,
  AssetOptions,
} from '../interface';

async function getInfo(user: User) {
  await abstractService('createUser', user);
  const resp: Response = await abstractService('getUser', user);
  resp.data = resp.data.attributes;
  return resp;
};

export const user: AssetOptions = {
  getInfo,
}