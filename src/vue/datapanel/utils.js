const {
  keys,
} = Object;
export const noop = v => v;

export const isFunc = input => typeof input === 'function';

export const toConn = (input = '') => input.replace(/[A-Z]/g, m => `-${m.toLowerCase()}`);

/**
 * vue 浅比较
 * @param {*} src
 * @param {*} tgt
 */
export const shallowVueEq = (src = {}, tgt = {}) => {
  let result = true;
  const source = src || {};
  const target = tgt || {};
  const set = new Set([...keys(source), ...keys(target)]);
  set.forEach((key) => {
    if (source[key] !== target[key]) {
      if ((source[key] === null && !(key in target))
        || (target[key] === null && !(key in source))) {
        return;
      }
      result = false;
    }
  });
  return result;
};

/**
 * genRand
 * @param {*} input
 */
export const genRand = (input = '') => `${input}_${(Math.random().toString(36).slice(2))}`;

/**
 * 判断 transform 可见
 * @param {*} input
 *
 * 以下三种 transform 可认为隐藏
 * - transform: scale(0, 0);
 * - transform: translateX(-9999px);
 * - transform: rotateX(90deg);
 *
 */
export const isHiddenTransform = (input = '') => [
  /scale\(0\s*,\s*0\)/,
  /translateX\(\s*-9999px\s*\)/,
  /rotateX\(\s*90deg\s*\)/,
].some(re => re.test(input));

/**
 * 判断样式可见
 * @param {*} el
 *
 * 以下各条件符合，可认为样式隐藏
 * - position: fixed; top:-9999px;
 * - width: 0;
 * - opacity: 0;
 * - visibility: hidden;
 * - z-index: -999; position: relative;
 *
 */
export const isStyleVisible = (el) => {
  const {
    display,
    opactiy,
    visibility,
    zIndex,
    width,
    transform,
    top,
  } = getComputedStyle(el);
  const hidden = el.getAttribute('hidden');
  return display !== 'none'
    && (opactiy === undefined || opactiy > 0)
    && visibility !== 'hidden'
    && !(zIndex < -100)
    && +width !== 0
    && !isHiddenTransform(transform)
    && hidden == null
    && !(top.replace(/px$/, '') < -9000);
};

/**
 * 过滤不需要的 key
 * @param {*} obj
 * @param {*} fiterlist
 */
export const filterKeys = (obj = {}, fiterlist = []) => Object.keys(obj)
  .reduce((res, key) => {
    if (fiterlist.includes(key)) {
      return res;
    }
    res[key] = obj[key];
    return res;
  }, {});

/**
 * weakmap/map 操作
 * @param {*} object
 */
export const createCach = object => ({
  set(key, value) {
    object.set(key, value);
  },
  get(key) {
    return object.get(key);
  },
  // [待观察] 理论上，weakmap 的弱引用会自动回收 key
  remove(key) {
    return object.delete(key);
  },
});

/**
 * 合并对象 key
 * @param {*} target
 * @param {*} source
 * @param {*} type
 */
export const combineObj = (target = {}, source = {}, type) => {
  switch (type) {
    case 'exclude':
      keys(source).forEach((k) => {
        if (!(k in target)) {
          target[k] = source[k];
        }
      });
      break;
    case 'include':
      keys(source).forEach((k) => {
        if (k in target) {
          target[k] = source[k];
        }
      });
      break;
    default:
      break;
  }
  return target;
};
