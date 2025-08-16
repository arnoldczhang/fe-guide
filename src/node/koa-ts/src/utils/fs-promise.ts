import * as fs from 'fs';
import * as util from 'util';

export const writeFile = util.promisify(fs.writeFile);
export const readFile = util.promisify(fs.readFile);
export const exists = util.promisify(fs.exists);
export const unlink = util.promisify(fs.unlink);
