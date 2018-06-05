enum UserStatus {
  DONE,
  UNDONE,
  DOING,
}

interface LeanObject extends Object {
  attributes?: Object,
}

interface Response{
  code?: number,
  subcode?: number,
  data?: LeanObject,
  message?: string,
  errorMessage?: string,
};

interface User {
  name: string;
  age?: number;
  openid?: string;
  status?: UserStatus;
}

interface Log {
  title?: string;
  message?: string;
  insertTime?: number;
  updateTime?: number;
}

interface AssetOptions {
  [key:string]: any;
}

export {
  UserStatus,
  AssetOptions,
  LeanObject,
  Response,
  User,
  Log,
}