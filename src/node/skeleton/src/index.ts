import { join } from 'path';

import {
  ROOT,
  SKELETON_COMPS_ROOT,
  SKELETON_PAGES_ROOT,
  SRC,
} from './config';
import { genNewComponent, getPageWxml } from './utils';

const run = () => {
  const pageWxml = getPageWxml(`${ROOT}/src/pages/*/*.wxml`);
  const wxml = pageWxml[2];
  // console.log(ROOT);
  genNewComponent(wxml, {
    root: ROOT,
    srcPath: SRC,
    pagePath: SKELETON_PAGES_ROOT,
    compPath: SKELETON_COMPS_ROOT,
  });
  // console.log(content);
  // console.log(json2html(result));
  // console.log(transJson2html(ast));
  // html2ast(content).then((res) => {
  //   console.log(content, res.length);
  // });
};

run();

export default run;
