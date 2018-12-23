const forEach = (forEachFunc, array = []) => array.forEach(forEachFunc);
const every = (everyFunc, array = []) => array.every(everyFunc);
const map = (mapFunc, array = []) => array.map(mapFunc);
const compose = (...funcs) => value => funcs.reduce((res, func) => func(res), value);
const filter = (filterFunc, array = []) => array.filter(filterFunc);
const concat = (base = [], ...args) => [].concat.call(base, ...args);
const sort = (sortFunc, array = []) => array.sort(sortFunc);
const reduce = (reduceFunc, initial, list = []) => list.reduce(reduceFunc, initial);


