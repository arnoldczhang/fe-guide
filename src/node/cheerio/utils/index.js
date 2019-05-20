'use strict';

const dateFormat =require('dateformat');

exports.getCatUrl = (conf) => [
  `&logQuery.day=${conf.day || '2019-05-01'}`,
  `&logQuery.startTime=${conf.startTime || '00:00'}`,
  `&logQuery.endTime=${conf.endTime || '01:00'}`,
  `&logQuery.pageUrl=${conf.pageUrl || 'all'}`,
  `&logQuery.level=${conf.level || 'error'}`,
  `&logQuery.category=${conf.category || 'jsError'}`,
  `&logQuery.platform=${conf.platform || '-1'}`,
  `&logQuery.city=${conf.city || '-1'}`,
  `&logQuery.network=${conf.network || '-1'}`,
  `&logQuery.operator=${conf.operator || '-1'}`,
  `&logQuery.container=${conf.container || '1'}`,
  `&logQuery.secCategory=${conf.secCategory || 'all'}`,
].join('');

exports.getTrendUrl = (conf) => [
  `?id=${conf.id || 3375}`,
  `&startTime=${conf.startTime || ''}`,
  `&endTime=${conf.endTime || ''}`,
  `&stepInSeconds=${conf.stepInSeconds || 60}`,
  `&set=${conf.set || ''}`,
  `&idc=${conf.idc || ''}`,
  `&dashBoardId=${conf.dashBoardId || 311}`,
].join('');

exports.getDateString = (date = Date.now()) => dateFormat(date, 'yyyymmddHHMM');

exports.toFixed = (number = 0, accuracy = 2) => number.toFixed(accuracy);

exports.hasIn = ([ min, max ], arr) => (
  Array.isArray(arr)
    ? arr.some(val => val >= min && val <= max)
    : arr >= min && arr <= max
);
