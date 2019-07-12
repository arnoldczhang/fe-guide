import {
  SKELETON_DEFAULT_WXSS,
} from './dir';

export const COMP_JSON = `{
  "component": true,
  "usingComponents": {}
}`;

export const COMP_WXSS = `@import '${SKELETON_DEFAULT_WXSS}'`;

export const DEFAULT_WXSS = `
.skull-grey {
  background: #f4f4f4!important;
}
`;

export const COMP_JS = `Component({
  options: {
    multipleSlots: false,
  },
  properties: {
  },
  data: {
  },
  attached() {
  },
  methods: {
  },
});
`;

export const COMP_WXML = ``;

export const wx = new Proxy({}, {
  get(key) {
    const fn = () => wx;
    fn.__proto__ = wx;
    return fn;
  },
});
