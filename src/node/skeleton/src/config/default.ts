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
  background: #eee!important;
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
  methods: {
  },
});
`;

export const COMP_WXML = ``;
