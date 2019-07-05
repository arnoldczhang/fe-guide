import {
  ROOT,
  SKELETON_COMPS_ROOT,
  SKELETON_PAGES_ROOT,
  SKELETON_ROOT,
  SRC,
} from './config';
import { genNewComponent, genResourceFile, getPageWxml } from './utils';

const run = () => {
  const pageWxml = getPageWxml(`${ROOT}/src/pages/*/*.wxml`);
  const wxml = pageWxml[2];
  genNewComponent(wxml, {
    root: ROOT,
    srcPath: SRC,
    outputPath: SKELETON_ROOT,
    pagePath: SKELETON_PAGES_ROOT,
    compPath: SKELETON_COMPS_ROOT,
  });
  genResourceFile();
};

run();

export default run;
