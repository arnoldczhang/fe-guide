import {
  StartConfig,
  CharacterAttr,
  BaseAttr,
  MartialAttr,
} from '../types';
import { inArray } from './index';
import {
  defaultBaseAttribute,
  defaultMartialAttribute,
} from './constant';

interface CharacterInterface {
  getRandom(input?: number): number;
  updateRemainData(): void;
  updateBaseAttr(attribute: BaseAttr): void;
  updateMartialAttr(attribute: MartialAttr): void;
  configStaticAttr(): this;
  configBaseAttr(): this;
  configMartialAttr(): this;
  configOtherAttr(): this;
  generate(): CharacterAttr;
}

class BaseCharacter {
  character: CharacterAttr;
  config: StartConfig;
  remainMin: number;
  remainRatio: number;

  constructor(config: StartConfig) {
    this.remainMin = 20;
    this.remainRatio = 10;
    this.config = config;
    this.character = {};
  }
}

export class Character extends BaseCharacter implements CharacterInterface {
  constructor(config: StartConfig) {
    super(config);
    this.configStaticAttr()
      .configBaseAttr()
      .configMartialAttr()
      .configOtherAttr()
      .generate();
  }

  getRandom(input?: number) {
    return Math.ceil(Math.random() * (input || 20));
  }

  updateRemainData() {
    const { feature } = this.config;
    const remain = new Array<number>(2);

    if (inArray(feature || [], '医')) {
      this.remainMin += this.getRandom();
      this.remainRatio += this.getRandom();
    }
    remain[0] = this.remainMin;
    remain[1] = this.remainMin + this.getRandom(this.remainRatio);
    this.character.remain = remain;
  }

  updateBaseAttr(attribute: BaseAttr) {
    const { experience =[] } = this.config;
    experience.forEach((exper: string): void => {
      switch(exper) {
        case '风':
          attribute.speed += this.getRandom();
          break;
        case '林':
          attribute.understanding += this.getRandom();
          break;
        case '火':
          attribute.speed += this.getRandom();
          attribute.inner += this.getRandom();
          break;
        case '山':
          attribute.physique += this.getRandom();
          attribute.strength += this.getRandom();
          break;
        case '阴':
          attribute.agile += this.getRandom();
          attribute.charm += this.getRandom();
          break;
        case '雷':
          attribute.physique += this.getRandom();
          attribute.strength += this.getRandom();
          attribute.agile += this.getRandom();
          attribute.speed += this.getRandom();
          break;
      }
    });
  }

  updateMartialAttr(attribute: MartialAttr) {
    
  }

  configStaticAttr() {
    const {
      name,
      age,
    } = this.config;

    this.character.name = name;
    this.character.age = age;
    this.updateRemainData();
    return this;
  }

  configBaseAttr() {
    this.character.baseAttribute = Object.assign({}, defaultBaseAttribute);
    this.updateBaseAttr(this.character.baseAttribute);
    return this;
  }

  configMartialAttr() {
    this.character.martialAttribute = Object.assign({}, defaultMartialAttribute);
    this.updateMartialAttr(this.character.martialAttribute);
    return this;
  }


  configOtherAttr() {
    return this;
  }

  generate() {
    return this.character;
  }
}

export default Character;
