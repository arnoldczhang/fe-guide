import { join } from 'path';

export const ABS = process.cwd();

export const ROOT = join(ABS, '.');

export const SRC = `${ROOT}/src`;

export const SKELETON = 'skeleton';

export const SKELETON_RELATIVE = `/${SKELETON}`;

export const SKELETON_ROOT = `${SRC}${SKELETON_RELATIVE}`;

export const SKELETON_DEFAULT_WXSS_FILE = `/${SKELETON}.wxss`;

export const SKELETON_DEFAULT_JS_FILE = `/${SKELETON}.js`;

export const SKELETON_DEFAULT_WXSS = `${SKELETON_RELATIVE}${SKELETON_DEFAULT_WXSS_FILE}`;

export const SKELETON_PAGES_ROOT = `${SKELETON_ROOT}/pages`;

export const SKELETON_COMPS_ROOT = `${SKELETON_ROOT}/components`;
