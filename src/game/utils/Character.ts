import {
  StartConfig,
  CharacterAttr,
  BaseAttr,
  MartialAttr,
  OtherAttr,
  Resource,
} from '../types';
import { inArray } from './index';
import { Category } from '../enum';
import {
  defaultBaseAttribute,
  defaultMartialAttribute,
  defaultOtherAttribute,
  defaultResource,
  baseResourceCount,
  wddj,
} from './constant';

interface CharacterInterface {
  getRandom(input?: number): number;
  updateRemainData(): void;
  updateResource(resource: Resource): void;
  updateBaseAttr(attribute: BaseAttr): void;
  updateMartialAttr(attribute: MartialAttr): void;
  configStaticAttr(): this;
  configBaseAttr(): this;
  configMartialAttr(): this;
  configResource(): this;
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
    this.character = {
      favor: '',
      hate: '',
      martials: {
        [Category.sword]: [wddj],
      },
    };
  }
}

export class Character extends BaseCharacter implements CharacterInterface {
  constructor(config: StartConfig) {
    super(config);
    this.configStaticAttr()
      .configBaseAttr()
      .configMartialAttr()
      .configOtherAttr()
      .configResource()
      .generate();
  }

  getRandom(input?: number) {
    return Math.ceil(Math.random() * (input || 20));
  }

  updateRemainData() {
    const { feature } = this.config;
    const remain = new Array<number>(2);

    if (inArray(feature || [], Category.doctor)) {
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
        case Category.wind:
          attribute.speed += this.getRandom(30);
          break;
        case Category.forest:
          attribute.understanding += this.getRandom(30);
          break;
        case Category.fire:
          attribute.speed += this.getRandom(30);
          attribute.inner += this.getRandom(30);
          break;
        case Category.moutain:
          attribute.physique += this.getRandom(30);
          attribute.strength += this.getRandom(30);
          break;
        case Category.strangeness:
          attribute.agile += this.getRandom(30);
          attribute.charm += this.getRandom(30);
          break;
        case Category.thunder:
          attribute.physique += this.getRandom(50);
          attribute.strength += this.getRandom(50);
          attribute.agile += this.getRandom(50);
          attribute.speed += this.getRandom(50);
          break;
      }
    });
  }

  updateMartialAttr(attribute: MartialAttr) {
    const { experience =[] } = this.config;
    experience.forEach((exper: string): void => {
      switch(exper) {
        case Category.wind:
          attribute.sword[0] += this.getRandom(30);
          break;
        case Category.fire:
          attribute.blade[0] += this.getRandom(30);
          break;
        case Category.moutain:
          attribute.fist[0] += this.getRandom(30);
          break;
        case Category.strangeness:
          attribute.pike[0] += this.getRandom(30);
          break;
        case Category.thunder:
          attribute.internal[0] += this.getRandom(50);
          attribute.sword[0] += this.getRandom(50);
          break;
      }
    });
  }

  updateOtherAttr(attribute: OtherAttr) {
    const { feature =[] } = this.config;
    feature.forEach((feat: string): void => {
      switch(feat) {
        case Category.doctor:
          attribute.doctor[0] += this.getRandom(50);
          break;
        case Category.carpenter:
          attribute.carpenter[0] += this.getRandom(50);
          break;
        case Category.blacksmith:
          attribute.blacksmith[0] += this.getRandom(50);
          break;
        case Category.tao:
          attribute.tao[0] += this.getRandom(50);
          break;
        case Category.woven:
          attribute.woven[0] += this.getRandom(50);
          break;
        case Category.craft:
          attribute.craft[0] += this.getRandom(50);
          break;
        case Category.identification:
          attribute.identification[0] += this.getRandom(50);
          break;
      }
    });
  }

  updateResource(resource: Resource) {
    const { treasure = [] } = this.config;
    treasure.forEach((trea: string): void => {
    switch (trea) {
        case Category.wood:
          resource.wood += this.getRandom(baseResourceCount);
          break;
        case Category.stone:
          resource.stone += this.getRandom(baseResourceCount);
          break;
        case Category.food:
          resource.food += this.getRandom(baseResourceCount);
          break;
        case Category.golden:
          resource.golden += this.getRandom(baseResourceCount);
          break;
        case Category.cloth:
          resource.cloth += this.getRandom(baseResourceCount);
          break;
      }
    });
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

  configResource() {
    this.character.resource = Object.assign({}, defaultResource);
    this.updateResource(this.character.resource);
    return this;
  }

  configOtherAttr() {
    this.character.otherAttribute = Object.assign({}, defaultOtherAttribute);
    this.updateOtherAttr(this.character.otherAttribute);
    return this;
  }

  generate() {
    return this.character;
  }
}

export default Character;
