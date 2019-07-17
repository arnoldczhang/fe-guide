import { PRE } from './attr';
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
  background: #f4f4f4!important;
  color: #f4f4f4!important;
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
