import { animationStyle, ICO } from '../types';
import { getRelativePath } from '../utils';
import { isStr } from '../utils/assert';
import { isColor } from '../utils/reg';
import { JELLY_STYLE, PRE, SHINE_STYLE } from './attr';
import {
  SKELETON_DEFAULT_JS_FILE,
  SKELETON_DEFAULT_WXSS,
} from './dir';

export const COMP_JSON = `{
  "component": true,
  "usingComponents": {}
}`;

export const COMP_JS = `Component({...require('/skeleton${SKELETON_DEFAULT_JS_FILE}')});`;

export const DEFAULT_JS = `
module.exports = {
  options: {
    multipleSlots: false,
  },
  properties: {
  },
  data: {
  },
  pageLifetimes: {
    show() {
      this.triggerEvent('show');
    },
    hide() {
      this.triggerEvent('hide');
    },
    resize(size) {
      this.triggerEvent('resize', size);
    },
  },
  created() {
    this.triggerEvent('created');
  },
  attached() {
    this.triggerEvent('attached');
  },
  ready() {
    this.triggerEvent('ready');
  },
  moved() {
    this.triggerEvent('moved');
  },
  detached() {
    this.triggerEvent('detached');
  },
  methods: {
  },
};
`;

export const COMP_WXML = ``;

export const wx: ICO = new Proxy({}, {
  get(target, key) {
    if (key === Symbol.toPrimitive) {
      return () => '';
    }
    const fn = () => wx;
    fn.__proto__ = wx;
    fn.toString = fn.valueOf = () => false;
    return fn;
  },
});

// wxss
export const COMP_WXSS = `@import '${SKELETON_DEFAULT_WXSS}';`;

export const WXSS_BG_GREY = `${PRE}-default-grey`;

export const WXSS_BG_DARK_GREY = `${PRE}-default-dark-grey`;

export const WXSS_BG_LIGHT_GREY = `${PRE}-default-light-grey`;

export const DEFAULT_WXSS = new Map();

DEFAULT_WXSS.set([
  WXSS_BG_GREY,
  WXSS_BG_DARK_GREY,
  WXSS_BG_LIGHT_GREY,
], `
  position: relative;
  background: #f4f4f4!important;
  color: #f4f4f4!important;
  overflow: hidden;
  outline: none;
  border: none;
  z-index: 1;
`);

DEFAULT_WXSS.set(WXSS_BG_DARK_GREY, `
  background: #c4c4c4!important;
  color: #c4c4c4!important;
`);

DEFAULT_WXSS.set(WXSS_BG_LIGHT_GREY, `
  background: #fdfdfd!important;
  color: #fdfdfd!important;
`);

export const updateBgWxss = (
  key: string,
  color: string,
) => {
  if (isColor(color)) {
    DEFAULT_WXSS.set([key], `background: ${color}!important; color: ${color}!important;`);
  }
};

export const updateDefaultWxss = (styles: animationStyle | animationStyle[]): void => {
  if (isStr(styles)) {
    styles = [styles as animationStyle];
  }
  (styles as animationStyle[]).forEach((style: animationStyle) => {
    switch (style) {
      case SHINE_STYLE:
        DEFAULT_WXSS.set(`${WXSS_BG_GREY}::after`, `
        content: '';
        outline: none;
        border: none;
        z-index: 1;
        background-color: hsla(0, 0%, 100%, 0.3);
        position: absolute;
        top: -50%;
        bottom: -50%;
        width: 30rpx;
        animation: shineAnim 1.8s infinite;
        -webkit-animation: shineAnim 1.8s infinite;
        `);
        DEFAULT_WXSS.set('@keyframes shineAnim', `
        0% { transform: translate3d(-300%, 0, 0) rotate(35deg); }
        100% { transform: translate3d(2500%, 0, 0) rotate(35deg); }
        `);
        DEFAULT_WXSS.set('@-webkit-keyframes shineAnim', `
        0% { transform: translate3d(-300%, 0, 0) rotate(35deg); }
        100% { transform: translate3d(2500%, 0, 0) rotate(35deg); }
        `);
        break;
      case JELLY_STYLE:
        DEFAULT_WXSS.set(WXSS_BG_GREY, `
        position: relative;
        overflow: hidden;
        outline: none;
        border: none;
        z-index: 1;
        animation: jelly 4s infinite 1s;
        -webkit-animation: jelly 4s infinite 1s;
      `);
        DEFAULT_WXSS.set('@keyframes jelly', `
        0%,68%,
        68% { transform: scale(1, 1);  }
        76% { transform: scale(0.9, 1.1); }
        84% { transform: scale(1.1, 0.9); }
        92% { transform: scale(0.95, 1.05); }
        100% { transform: scale(1, 1); }
        `);
        DEFAULT_WXSS.set('@-webkit-keyframes jelly', `
        0%,68%,
        68% { transform: scale(1, 1); }
        76% { transform: scale(0.9, 1.1); }
        84% { transform: scale(1.1, 0.9); }
        92% { transform: scale(0.95, 1.05); }
        100% { transform: scale(1, 1); }
        `);
        break;
    }
  });
};

export const getCompJs = (
  output: string,
  dest: string,
): string => {
  const relativePath = getRelativePath(`${output}/${SKELETON_DEFAULT_JS_FILE}`, dest);
  return `Component({...require('${relativePath}')});`;
};
