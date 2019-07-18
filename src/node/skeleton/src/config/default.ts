import { animationStyle } from '../types';
import { PRE, SHINE_STYLE } from './attr';
import {
  SKELETON_DEFAULT_JS_FILE,
  SKELETON_DEFAULT_WXSS,
} from './dir';

export const COMP_JSON = `{
  "component": true,
  "usingComponents": {}
}`;

export const COMP_WXSS = `@import '${SKELETON_DEFAULT_WXSS}'`;

export const COMP_JS = `Component({...require('/skeleton${SKELETON_DEFAULT_JS_FILE}')});`;

export const WXSS_BG_GREY = `${PRE}-default-grey`;

export const DEFAULT_WXSS = new Map();
DEFAULT_WXSS.set(WXSS_BG_GREY, `
  position: relative;
  background: #f4f4f4!important;
  color: #f4f4f4!important;
  overflow: hidden;
  outline: none;
  border: none;
  z-index: 1;
`);

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

export const wx: any = new Proxy({}, {
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

export const updateDefaultWxss = (style: animationStyle): void => {
  switch (style) {
    case SHINE_STYLE:
      DEFAULT_WXSS.set(`${WXSS_BG_GREY}::after`, `
      content: '';
      outline: none;
      border: none;
      z-index: 1;
      background-color: hsla(0, 0%, 100%, 0.2);
      position: absolute;
      top: -50%;
      bottom: -50%;
      width: 30rpx;
      animation: splashAnim 1.8s infinite;
      -webkit-animation: splashAnim 1.8s infinite;
      `);
      DEFAULT_WXSS.set('@keyframes splashAnim', `
      0% { transform: translate3d(-300%, 0, 0) rotate(35deg); }
      100% { transform: translate3d(2500%, 0, 0) rotate(35deg); }
      `);
      DEFAULT_WXSS.set('@-webkit-keyframes splashAnim', `
      0% { transform: translate3d(-300%, 0, 0) rotate(35deg); }
      100% { transform: translate3d(2500%, 0, 0) rotate(35deg); }
      `);
      break;
  }
};
