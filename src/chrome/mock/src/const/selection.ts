import { TYPE } from './index';

export const mockKey = {
  string510: '@string(5, 10)',
  ctitle510: '@ctitle(5, 10)',
  integer10100: '@integer(10, 100)',
  guid: '@guid()',
};

export const mockName = {
  [mockKey.string510]: '随机5~10位英文字母',
  [mockKey.ctitle510]: '随机5~10位中文',
  [mockKey.integer10100]: '随机10~100的数字',
  [mockKey.guid]: '随机uuid',
};

export const mockKeyMap: Record<string, string> = {
  [mockKey.string510]: mockName[mockKey.string510],
  [mockKey.ctitle510]: mockName[mockKey.ctitle510],
  [mockKey.integer10100]: mockName[mockKey.integer10100],
  [mockKey.guid]: mockName[mockKey.guid],
};

export const mockSelection = [
  {
    value: '',
    label: '不使用mock',
  },
  {
    value: mockKey.string510,
    label: mockName[mockKey.string510],
  },
  {
    value: mockKey.ctitle510,
    label: mockName[mockKey.ctitle510],
  },
  {
    value: mockKey.integer10100,
    label: mockName[mockKey.integer10100],
  },
  {
    value: mockKey.guid,
    label: mockName[mockKey.guid],
  },
];

export const typeSelection = Object.keys(TYPE).map((value) => ({
  value,
  label: value,
}));