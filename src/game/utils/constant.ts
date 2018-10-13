import {
  CO,
  PersonInfoInterface,
  SystemConfigInterface,
  AreaInfo,
  MartialArt,
  MartialArtMap,
  BaseAttr,
  MartialAttr,
  OtherAttr,
  Resource,
} from '../types';
import { SystemKeyEnum, Category, Config } from '../enum';

export const defaultNone = 'Nothing';

export const baseResourceCount = 1000;

// person info
export const treasureKey: Array<string> = [
  Category.wood,
  Category.stone,
  Category.food,
  Category.golden,
  Category.cloth,
];

export const treasureKeyExplain: CO<Array<string>> = {

};

export const treasure: CO = {
  [Category.wood]: 1,
  [Category.stone]: 1,
  [Category.food]: 1,
  [Category.golden]: 2,
  [Category.cloth]: 3,
};

export const featureKey: Array<string> = [
  Category.doctor,
  Category.tao,
  Category.identification,
  Category.carpenter,
  Category.blacksmith,
  Category.woven,
  Category.craft,
];

export const featureKeyExplain: CO<Array<string>> = {

};

export const feature: CO = {
  [Category.doctor]: 1,
  [Category.tao]: 1,
  [Category.identification]: 1,
  [Category.carpenter]: 2,
  [Category.blacksmith]: 2,
  [Category.woven]: 2,
  [Category.craft]: 2,
};

export const experienceKey: Array<string> = [
  Category.wind,
  Category.forest,
  Category.fire,
  Category.moutain,
  Category.strangeness,
  Category.thunder,
];

export const experiencekeyExplain: CO<Array<string>> = {
  [Category.wind]: [`${Category.speed}↑`, `${Category.sword}↑`],
  [Category.forest]: [`${Category.understanding}↑`],
  [Category.fire]: [`${Category.speed}↑`, `${Category.inner}↑`, `${Category.blade}↑`],
  [Category.moutain]: [`${Category.physique}↑`, `${Category.strength}↑`, `${Category.fist}↑`],
  [Category.strangeness]: [`${Category.agile}↑`, `${Category.charm}↑`, `${Category.pike}↑`],
  [Category.thunder]: [`${Category.physique}↑↑`, `${Category.strength}↑↑`, `${Category.agile}↑↑`, `${Category.speed}↑↑`, `${Category.inner}↑↑`, `${Category.sword}↑↑`],
};

export const experience: CO = {
  [Category.wind]: 1,
  [Category.forest]: 1,
  [Category.fire]: 2,
  [Category.moutain]: 2,
  [Category.strangeness]: 2,
  [Category.thunder]: 3,
};

// system info
export const levelKey: Array<string> = [
  Config.simple,
  Config.normal,
  Config.hard,
];
export const level: CO = {
  [Config.simple]: 0,
  [Config.normal]: 0.3,
  [Config.hard]: 0.5,
};

export const worldKey: Array<string> = [
  Config.rich,
  Config.welloff,
  Config.subsistent,
  Config.barren,
];

export const world: CO = {
  [Config.rich]: 0,
  [Config.welloff]: 0.3,
  [Config.subsistent]: 0.5,
  [Config.barren]: 0.9,
};

export const enemyKey: Array<string> = [
  Config.rare,
  Config.some,
  Config.various,
  Config.crazy,
];

export const enemy: CO = {
  [Config.rare]: 0,
  [Config.some]: 0.3,
  [Config.various]: 0.5,
  [Config.crazy]: 0.9,
};

// martialArt info
export const qhyl: MartialArt = {
  title: '岐黄要略',
  skilled: 1,
  introduce: defaultNone,
  traditional: true,
};

export const pscl: MartialArt = {
  title: '磐石锤炼篇',
  skilled: 1,
  introduce: defaultNone,
  traditional: true,
};

export const zsnf: MartialArt = {
  title: '彰施乃服篇',
  skilled: 1,
  introduce: defaultNone,
  traditional: true,
};

export const gbdyj: MartialArt = {
  title: '工布独一剑',
  skilled: 1,
  introduce: defaultNone,
  traditional: true,
};

export const wddj: MartialArt = {
  title: '武当丹剑',
  skilled: 1,
  introduce: defaultNone,
  traditional: true,
};

export const kongsangMAM: MartialArtMap = {
  [Category.internal]: [qhyl],
};

export const kongsang: AreaInfo = {
  title: '空桑',
  key: 'kongsang',
  color: 'green',
  content: '空桑空桑空桑空桑空桑',
  martial: kongsangMAM,
  selected: false,
};

export const zhujianMAM: MartialArtMap = {
  [Category.internal]: [pscl, zsnf],
  [Category.sword]: [gbdyj],
};

export const zhujian: AreaInfo = {
  title: '铸剑山庄',
  key: 'zhujian',
  color: 'yellow',
  content: '铸剑山庄位于湛庐山，相传乃是铸剑祖师欧冶子所创建。',
  martial: zhujianMAM,
  selected: false,
};

export const defaultPersonInfoList: Array<PersonInfoInterface> = [
  {
    title: 'experience',
    key: 'experience',
    placeholder: 'choose your experience',
    keyArray: experienceKey,
    keyExplain: experiencekeyExplain,
    keyObject: experience,
  },
  {
    title: 'treasure',
    key: 'treasure',
    placeholder: 'choose your treasure',
    keyArray: treasureKey,
    keyExplain: treasureKeyExplain,
    keyObject: treasure,
  },
  {
    title: 'feature',
    key: 'feature',
    placeholder: 'choose your feature',
    keyArray: featureKey,
    keyExplain: featureKeyExplain,
    keyObject: feature,
  },
];

export const defaultSystemList: Array<SystemConfigInterface> = [
  {
    title: 'level',
    key: SystemKeyEnum.LEVEL,
    keyArray: levelKey,
    keyObject: level,
    defaultValue: Config.simple,
  },
  {
    title: 'world',
    key: SystemKeyEnum.WORLD,
    keyArray: worldKey,
    keyObject: world,
    defaultValue: Config.rich,
  },
  {
    title: 'enemy',
    key: SystemKeyEnum.ENEMY,
    keyArray: enemyKey,
    keyObject: enemy,
    defaultValue: Config.rare,
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

export const defaultBaseAttribute: BaseAttr = {
  [Category.strength]: 50,
  [Category.agile]: 50,
  [Category.physique]: 50,
  [Category.inner]: 50,
  [Category.speed]: 50,
  [Category.charm]: 50,
  [Category.understanding]: 50,
};

export const defaultMartialAttribute: MartialAttr = {
  [Category.sword]: [50, 0],
  [Category.blade]: [50, 0],
  [Category.fist]: [50, 0],
  [Category.pike]: [50, 0],
  [Category.internal]: [50, 0],
  [Category.lightfoot]: [50, 0],
  [Category.special]: [50, 0],
};

export const defaultOtherAttribute: OtherAttr = {
  [Category.doctor]: [50, 0],
  [Category.carpenter]: [50, 0],
  [Category.blacksmith]: [50, 0],
  [Category.tao]: [50, 0],
  [Category.woven]: [50, 0],
  [Category.craft]: [50, 0],
  [Category.identification]: [50, 0],
};

export const defaultResource: Resource = {
  [Category.wood]: baseResourceCount,
  [Category.stone]: baseResourceCount,
  [Category.food]: baseResourceCount,
  [Category.golden]: baseResourceCount,
  [Category.cloth]: baseResourceCount,
};
