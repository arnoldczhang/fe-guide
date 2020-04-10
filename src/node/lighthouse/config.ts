/**
 * mobile config
 */
export const mobileConfig = require('lighthouse/lighthouse-core/config/lr-mobile-config.js');

/**
 * pc config
 */
export const pcConfig = require('lighthouse/lighthouse-core/config/lr-desktop-config.js');

/**
 * lighthouse default config
 */
export const lhDefaultConfig = require('lighthouse/lighthouse-core/config/default-config.js');

/**
 * lighthouse fulll config
 */
export const fullConfig = require('lighthouse/lighthouse-core/config/full-config.js');

/**
 * only performance config
 */
export const perfConfig = require('lighthouse/lighthouse-core/config/perf-config.js');

export const defaultChromeConfig = {
  logLevel: 'info',
  chromeFlags: ['--headless', '--show-paint-rects'],
};

const {
  keys,
} = Object;
const {
  settings: {
    throttlingMethod,
    ...otherSettings
  },
} = perfConfig;

const {
  categories,
} = lhDefaultConfig;

const includeAudits = [
  'first-contentful-paint',
  'first-meaningful-paint',
  'speed-index',
  'interactive',
  'first-cpu-idle',
  'max-potential-fid',
  'screenshot-thumbnails',
];

const onlyCategories = [
  'performance',
  // 'best-practices',
];

const allAudits = keys(categories)
  .filter((key: string) => onlyCategories.includes(key))
  .reduce((res: string[], key: string) => res.concat(
    categories[key].auditRefs.map((audit: ICO) => audit.id)
  ), []);

const skipAudits = allAudits.filter((audit: string) => !includeAudits.includes(audit));

const defaultConfig = {
  extends: 'lighthouse:default',
  settings: {
    ...otherSettings,
    onlyCategories,
    skipAudits,
    locale: 'zh',
  }
};

export default defaultConfig;
