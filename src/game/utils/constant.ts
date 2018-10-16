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
  CombatAttr,
  Weapon,
} from '../types';
import { SystemKeyEnum, Category, Config } from '../enum';

export const defaultNone = 'Nothing';

export const baseResourceCount = 1000;

export const baseAttrCount = 50;

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
  required: {
    [Category.sword]: 50,
    [Category.tao]: 30,
  },
  effects: {
    [Category.hp]: 100,
    [Category.ihp]: 60,
  },
  ratio: {
    [Category.force]: [0.4, 100],
    [Category.subtle]: [0.3, 50],
    [Category.swift]: [0.3, 30],
  },
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
  [Category.strength]: baseAttrCount,
  [Category.agile]: baseAttrCount,
  [Category.physique]: baseAttrCount,
  [Category.inner]: baseAttrCount,
  [Category.speed]: baseAttrCount,
  [Category.charm]: baseAttrCount,
  [Category.understanding]: baseAttrCount,
};

// [Talent, attainment]
export const defaultMartialAttribute: MartialAttr = {
  [Category.sword]: [baseAttrCount, 0],
  [Category.blade]: [baseAttrCount, 0],
  [Category.fist]: [baseAttrCount, 0],
  [Category.pike]: [baseAttrCount, 0],
  [Category.internal]: [baseAttrCount, 0],
  [Category.lightfoot]: [baseAttrCount, 0],
  [Category.special]: [baseAttrCount, 0],
};

export const defaultOtherAttribute: OtherAttr = {
  [Category.doctor]: [baseAttrCount, 0],
  [Category.poison]: [baseAttrCount, 0],
  [Category.carpenter]: [baseAttrCount, 0],
  [Category.blacksmith]: [baseAttrCount, 0],
  [Category.tao]: [baseAttrCount, 0],
  [Category.woven]: [baseAttrCount, 0],
  [Category.craft]: [baseAttrCount, 0],
  [Category.identification]: [baseAttrCount, 0],
};

export const defaultResource: Resource = {
  [Category.wood]: baseResourceCount,
  [Category.stone]: baseResourceCount,
  [Category.food]: baseResourceCount,
  [Category.golden]: baseResourceCount,
  [Category.cloth]: baseResourceCount,
};

export const defaultCombatAttr: CombatAttr = {
  [Category.hp]: 100,
  [Category.ihp]: 100,
  [Category.defence]: 50,
  [Category.idefence]: 50,
  [Category.force]: 10,
  [Category.subtle]: 10,
  [Category.swift]: 10,
  [Category.tackle]: 10,
  [Category.unload]: 10,
  [Category.miss]: 10,
  [Category.attackRatio]: 1,
  [Category.iattackRatio]: 1,
  [Category.defenceRatio]: 1,
  [Category.idefenceRatio]: 1,
};

export const emptyHand: Weapon = {
  title: '空手',
  skilled: 1,
  cost: 1,
  introduce: defaultNone,
  required: {
    [Category.fist]: 50,
    [Category.agile]: 50,
  },
  effects: {
    [Category.hp]: 100,
    [Category.ihp]: 60,
  },
  ratio: {
    [Category.force]: [0.4, 100],
    [Category.subtle]: [0.3, 50],
    [Category.swift]: [0.3, 30],
  },
};

export const branch: Weapon = {
  title: '树枝',
  icon: require('../img/shuzhi.jpeg'),
  skilled: 1,
  cost: 3,
  introduce: defaultNone,
  required: {
    [Category.sword]: 50,
    [Category.agile]: 50,
  },
  effects: {
    [Category.hp]: 100,
    [Category.ihp]: 60,
  },
  ratio: {
    [Category.force]: [0.4, 100],
    [Category.subtle]: [0.3, 50],
    [Category.swift]: [0.3, 30],
  },
};

export const stone: Weapon = {
  title: '石子',
  skilled: 1,
  cost: 5,
  introduce: defaultNone,
  required: {
    [Category.special]: 50,
    [Category.agile]: 50,
  },
  effects: {
    [Category.hp]: 100,
    [Category.ihp]: 60,
  },
  ratio: {
    [Category.force]: [0.4, 100],
    [Category.subtle]: [0.3, 50],
    [Category.swift]: [0.3, 30],
  },
};

export const woodenSword: Weapon = {
  title: '木剑',
  skilled: 1,
  cost: 5,
  introduce: defaultNone,
  required: {
    [Category.sword]: 50,
    [Category.agile]: 50,
  },
  effects: {
    [Category.hp]: 100,
    [Category.ihp]: 60,
  },
  ratio: {
    [Category.force]: [0.4, 101],
    [Category.subtle]: [0.3, 50],
    [Category.swift]: [0.3, 30],
  },
};

export const woodenPike: Weapon = {
  title: '木棍',
  skilled: 1,
  cost: 5,
  introduce: defaultNone,
  required: {
    [Category.pike]: 50,
    [Category.agile]: 50,
  },
  effects: {
    [Category.hp]: 100,
    [Category.ihp]: 60,
  },
  ratio: {
    [Category.force]: [0.4, 101],
    [Category.subtle]: [0.3, 50],
    [Category.swift]: [0.3, 30],
  },
};

export const woodenDart: Weapon = {
  title: '竹镖',
  skilled: 1,
  cost: 5,
  introduce: defaultNone,
  required: {
    [Category.special]: 50,
    [Category.agile]: 50,
  },
  effects: {
    [Category.hp]: 100,
    [Category.ihp]: 60,
  },
  ratio: {
    [Category.force]: [0.4, 101],
    [Category.subtle]: [0.3, 50],
    [Category.swift]: [0.3, 30],
  },
};

export const heal: Weapon = {
  title: '治疗',
  skilled: 1,
  cost: 3,
  introduce: defaultNone,
  times: 2,
  required: {
    [Category.agile]: 50,
    [Category.doctor]: 50,
  },
  effects: {
    [Category.hp]: -60,
    [Category.ihp]: -30,
  },
};

export const depoison: Weapon = {
  title: '祛毒',
  skilled: 1,
  cost: 3,
  introduce: defaultNone,
  required: {
    [Category.poison]: 50,
  },
  effects: {
    [Category.hp]: -60,
    [Category.ihp]: -30,
  },
};

export const escape: Weapon = {
  title: '逃跑',
  skilled: 1,
  cost: 3,
  introduce: defaultNone,
  required: {
    [Category.speed]: 50,
  },
};

export const baseWeapon: Weapon[] = [
  emptyHand,
  branch,
  stone,
];

export const equipedWeapon: Weapon[] = [
  woodenSword,
  woodenPike,
  woodenDart,
];

export const baseAction: Weapon[] = [
  heal,
  depoison,
  escape,
];
