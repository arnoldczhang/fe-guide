import {
  EXAMPLE_SKELETON_ROOT,
  ROOT,
  SKELETON_COMPS_ROOT,
  SKELETON_PAGES_ROOT,
  SRC,
} from './config';
import { genNewComponent, getPageWxml } from './utils';

const run = () => {
  const pageWxml = getPageWxml(`${ROOT}/src/pages/*/*.wxml`);
  const wxml = pageWxml[2];
  genNewComponent(wxml, {
    root: ROOT,
    srcPath: SRC,
    examplePath: EXAMPLE_SKELETON_ROOT,
    pagePath: SKELETON_PAGES_ROOT,
    compPath: SKELETON_COMPS_ROOT,
  });
};

run();

export default run;
