export enum Stage {
  Create_0,
  Create_1,
  Create_2,
  Map,
  Home,
  Combat,
};

export enum Config {
  // level
  simple = 'simple',
  normal = 'normal',
  hard = 'hard',
  challenge = 'challenge',
  hell = 'hell',
  // world
  rich = 'rich',
  welloff = 'welloff',
  subsistent = 'subsistent',
  barren = 'barren',
  // enemy
  rare = 'rare',
  some = 'some',
  various = 'various',
  crazy = 'crazy',
};

export enum Category {
  // style
  wind = 'wind',
  forest = 'forest',
  fire = 'fire',
  moutain = 'moutain',
  strangeness = 'strangeness',
  thunder = 'thunder',
  // attribute
  speed = 'speed',
  understanding = 'understanding',
  inner = 'inner',
  agile = 'agile',
  physique = 'physique',
  strength = 'strength',
  charm = 'charm',
  // person data
  hp = 'hp',
  ihp = 'ihp',
  defence = 'defence',
  idefence = 'idefence',
  force = 'force', // li dao
  subtle = 'subtle', // jing miao
  swift = 'swift', // xun ji
  unload = 'unload', // xie li
  tackle = 'tackle', // chai zhao
  miss = 'miss', // shan bi
  // TODO other data
  attackRatio = 'attackRatio',
  iattackRatio = 'iattackRatio',
  defenceRatio = 'defenceRatio',
  idefenceRatio = 'idefenceRatio',
  // resource
  wood = 'wood',
  stone = 'stone',
  food = 'food',
  golden = 'golden',
  cloth = 'cloth',
  // martial
  internal = 'internal',
  lightfoot = 'lightfoot',
  special = 'special',
  sword = 'sword',
  blade = 'blade',
  fist = 'fist',
  pike = 'pike',
  // other
  doctor = 'doctor',
  poison = 'poison',
  carpenter = 'carpenter',
  blacksmith = 'blacksmith',
  tao = 'tao',
  woven = 'woven',
  craft = 'craft',
  identification   = 'identification',
};