import {
  CO,
  PersonInfoInterface,
  SystemConfigInterface,
  AreaInfo,
  MartialArt,
  MartialArtMap,
} from '../types';
import { SystemKeyEnum, Category } from '../enum';

// person info
export const treasureKey: Array<string> = ['树', '石', '金', '食', '衣'];
export const treasure: CO = {
  树: 1,
  石: 1,
  金: 2,
  食: 2,
  衣: 3,
};

export const featureKey: Array<string> = ['医', '木', '铁', '道', '织', '匠', '鉴'];
export const feature: CO = {
  医: 1,
  木: 1,
  铁: 2,
  道: 2,
  织: 2,
  匠: 3,
  鉴: 3,
};

export const experienceKey: Array<string> = ['风', '林', '火', '山', '阴', '雷'];
export const experience: CO = {
  风: 1,
  林: 1,
  火: 2,
  山: 2,
  阴: 2,
  雷: 3,
};

// system info
export const levelKey: Array<string> = ['简单', '普通', '困难'];
export const level: CO = {
  简单: 0,
  普通: 0.3,
  困难: 0.5,
};

export const worldKey: Array<string> = ['桃源', '普通', '贫瘠', '荒芜'];
export const world: CO = {
  桃源: 0,
  普通: 0.3,
  贫瘠: 0.5,
  荒芜: 0.9,
};

export const enemyKey: Array<string> = ['稀少', '普通', '繁多', '疯狂'];
export const enemy: CO = {
  稀少: 0,
  普通: 0.3,
  繁多: 0.5,
  疯狂: 0.9,
};

// martialArt info
export const qhyl: MartialArt = {
  title: '岐黄要略',
  skilled: 1,
  introduce: '暂无',
  traditional: true,
};

export const kongsangMAM: MartialArtMap = {
  [Category.internal]: [qhyl],
};

export const kongsang: AreaInfo = {
  title: '空桑',
  key: 'kongsang',
  color: 'green',
  content: '空桑又名空桑药王派，空桑山虽为雪山，却别有洞天',
  martial: kongsangMAM,
  selected: false,
};

export const zhujianMAM: MartialArtMap = {
  [Category.internal]: [qhyl],
};

export const zhujian: AreaInfo = {
  title: '铸剑',
  key: 'zhujian',
  color: 'yellow',
  content: '铸剑铸剑铸剑铸剑',
  martial: zhujianMAM,
  selected: false,
};

export const defaultPersonInfoList: Array<PersonInfoInterface> = [
  {
    title: '经历',
    key: 'experience',
    placeholder: '请选择经历',
    keyArray: experienceKey,
    keyObject: experience,
  },
  {
    title: '财富',
    key: 'treasure',
    placeholder: '请选择财富',
    keyArray: treasureKey,
    keyObject: treasure,
  },
  {
    title: '技艺',
    key: 'feature',
    placeholder: '请选择技艺',
    keyArray: featureKey,
    keyObject: feature,
  },
];

export const defaultSystemList: Array<SystemConfigInterface> = [
  {
    title: '难度',
    key: SystemKeyEnum.LEVEL,
    keyArray: levelKey,
    keyObject: level,
    defaultValue: '简单',
  },
  {
    title: '世界观',
    key: SystemKeyEnum.WORLD,
    keyArray: worldKey,
    keyObject: world,
    defaultValue: '桃源',
  },
  {
    title: '外道',
    key: SystemKeyEnum.ENEMY,
    keyArray: enemyKey,
    keyObject: enemy,
    defaultValue: '稀少',
  },
];

export const mapInfo: Array<Array<AreaInfo>> = [
  [
    {},
    {},
    {},
    kongsang,
  ],
  [
    {},
    kongsang,
    kongsang,
    kongsang,
  ],
  [
    kongsang,
    kongsang,
    kongsang,
    kongsang,
  ],
  [
    kongsang,
    kongsang,
    kongsang,
    zhujian,
  ],
  [
    kongsang,
    kongsang,
    kongsang,
    {},
  ],
];
