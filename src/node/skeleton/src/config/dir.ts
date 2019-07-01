import { join } from 'path';

export const ABS = process.cwd();

export const ROOT = join(ABS, '.');

export const EXAMPLE_ROOT = `${ROOT}/examples`;

export const SRC = `${ROOT}/src`;

export const EXAMPLE_SKELETON_ROOT = `${EXAMPLE_ROOT}/skeleton`;

export const SKELETON_PAGES_ROOT = `${EXAMPLE_SKELETON_ROOT}/pages`;

export const SKELETON_COMPS_ROOT = `${EXAMPLE_SKELETON_ROOT}/components`;
