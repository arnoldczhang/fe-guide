import { v4 as uuid } from 'uuid';
import { STATUS } from '@/const/index';
import { Tag, MockItem, TreeData } from '@/types/mock.d';

export const isObj = (val: any) => val && typeof val === 'object';

export const genCaseName = (random = Date.now()) => `case_${random}`;

export const genCaseNameCn = (random = Date.now()) => `案例_${random}`;

export const genAllData: Record<string, Function> = {
  boolean: () => ({ id: uuid(), value: true }),
  number: () => ({ id: uuid(), value: 0 }),
  string: () => ({ id: uuid(), value: '' }),
  null: () => ({ id: uuid(), value: null }),
  array: (data: TreeData) => {
    let { length = 0 } = data;
    length = Math.max(length, 1);
    return {
      id: uuid(),
      value: Array.from({ length }).map(() => ({
        col: uuid(),
      })),
      length: length,
      children: [{
        id: uuid(),
        label: 'col',
        value: 'hello world',
        type: 'string',
      }],
    };
  },
  object: () => ({
    id: uuid(),
    value: {},
    children: [],
  }),
};

export const genTreeData = (): TreeData => {
  return {
    id: uuid(),
    label: 'data',
    value: null,
    type: 'null',
    children: [],
  };
};

export const genTag = (): Tag => {
  const random = Date.now();
  return {
    id: uuid(),
    name: genCaseName(random),
    nameCn: genCaseNameCn(random),
    description: '这是一个案例',
    status: STATUS.enable,
    data: [genTreeData()],
  };
};

export const genMock = (): MockItem => {
  const random = Date.now();
  return {
    id: uuid(),
    name: `/api/list_${random}`,
    nameCn: `列表_${random}`,
    status: STATUS.enable,
    delay: false,
    tags: [genTag()],
  };
};

export const transArrayValue = (key: string | null, value: any): TreeData => {
  const [first] = value;
  return {
    id: uuid(),
    label: key,
    value,
    type: 'array',
    length: value.length,
    children: isObj(first)
      ? transformJson2TreeData(first)
      : [transBasicValue(null, first)],
  };
};
export const transObjectValue = (key: string, value: any): TreeData => {
  return {
    id: uuid(),
    label: key,
    value,
    type: 'object',
    children: transformJson2TreeData(value),
  };
};
export const transBasicValue = (key: string | null, value: any): TreeData => {
  return {
    id: uuid(),
    label: key,
    value,
    type: typeof value,
    mock: '',
  };
};

export const transKeyValue = (key: string, value: any): TreeData => {
  if (isObj(value)) {
    if (Array.isArray(value)) {
      return transArrayValue(key, value);
    }
    return transObjectValue(key, value);
  }
  return transBasicValue(key, value);
};

export const transformJson2TreeData = (json: Record<any, any> | any[]): TreeData[] => {
  const keyArray = Object.keys(json);
  if (Array.isArray(json)) {
    return [transArrayValue(null, json)];
  }
  return keyArray.map((key) => transKeyValue(key, json[key]));
};
