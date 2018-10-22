// https://mp.weixin.qq.com/s/xWcmE7F_4WKBs2FQlDP6jg
export type Animal = {
  weight: number;
};

// and
export type Monky = Animal & {
  leg: number;
};

// Record
export const record: Record<string, string|number> = {
  a: 1,
};

// get object`s keys
const obj = {
  a: 1,
  b: 'b',
  c: true,
};

type keys = keyof typeof obj;
export const key1: keys = 'a';
export const key2: keys = 'b';
export const key3: keys = 'c';

const obj2 = {
  name: 'Niko',
  age: 18,
  birthday: new Date(),
};

export const infos: Record<keyof typeof obj2, string> = {
  name: '',
  age: '',
};




