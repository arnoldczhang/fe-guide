import { AssertionError } from 'assert';
import {
  query, queueQuery, taskQueue, QueryResult
} from '../utils/clickhouse';
import config from '../config';

import dayjs = require('dayjs');
const env: string = require('../../env.js');

export type Timestamp = number;
export interface MetricItem {
  time: Timestamp;
  value: number;
}

function assertIsInterval(unit: string): asserts unit is 'm' | 'h' | 'd' {
  if (['m', 'h', 'd'].indexOf(unit) < 0) {
    throw new AssertionError({
      message: 'unit must one of m h d',
    });
  }
}
function intervalMS(interval: Interval): number {
  const intervalVal = parseInt(interval, 10);
  const intervalUnit = interval.substr(-1);
  assertIsInterval(intervalUnit);
  const unitMis = {
    m: 60 * 1000,
    h: 60 * 60 * 1000,
    d: 24 * 60 * 60 * 1000,
  };
  return intervalVal * unitMis[intervalUnit];
}

/**
 * 将一个时间按interval的值向前取整（将一天按照interval切分的片段的开始时间）
 * 2019-12-04 12:47:11 round 1m 则为2019-12-04 12:47:00
 * 2019-12-04 12:47:11 round 2m 则为2019-12-04 12:46:00
 * @param date
 * @param interval
 */
function roundTime(date: Date, interval: Interval) {
  // 向前取n个单位
  const mis = +date
    - +dayjs(date)
      .startOf('day')
      .toDate();
  return dayjs(date)
    .add(-mis % intervalMS(interval), 'millisecond')
    .toDate();
}

export default abstract class AbstractService {
  protected roundTime = roundTime;

  protected getTableName(tableName: string): string {
    if (tableName === 't_log_details' && env === 'pro') {
      tableName = 'm__log_details2';
    }
    return `${tableName}${env === 'pro' ? '_all' : ''}`;
  }

  protected getInterval(interval: Interval) {
    switch (interval) {
      case '1m':
        return 'interval 1 minute';
      case '3m':
        return 'interval 3 minute';
      case '5m':
        return 'interval 5 minute';
      case '10m':
        return 'interval 10 minute';
      case '15m':
        return 'interval 15 minute';
      case '1h':
        return 'interval 1 hour';
      case '1d':
        return 'interval 1 day';
    }
    throw new Error(`不支持的interval值${interval}`);
  }

  protected async query<T>(sql: string): Promise<QueryResult<T>> {
    const result = await query<T>(sql);
    return result;
  }

  protected async queueQuery<T>(sql: string): Promise<QueryResult<T>> {
    console.log(sql);
    const result = await queueQuery<T>(sql);
    return result;
  }

  protected async queryData<T>(sql: string): Promise<Array<T>> {
    console.log('=========================================');
    console.log(new Date());
    try {
      const result = await this.query<T>(sql);
      console.log(sql);
      if (config.ENV !== 'pro') {
        console.log('\n*****RESULT*****\n\n', result);
      }
      console.log('statistics:', result.statistics);
      console.log('transferred', result.transferred);
      return result.data;
    } catch (e) {
      console.log('error', sql);
      throw e;
    }
  }

  protected async queueQueryData<T>(sql: string): Promise<Array<T>> {
    console.log('=========================================');
    console.log(new Date());
    try {
      const result = await this.queueQuery<T>(sql);
      console.log(sql);
      if (config.ENV !== 'pro') {
        console.log('\n*****RESULT*****\n\n', result);
      }
      console.log('statistics:', result.statistics);
      console.log('transferred', result.transferred);
      console.log('task queue running: ', taskQueue.running(), ' waiting: ', taskQueue.length());
      return result.data;
    } catch (e) {
      console.log('error', sql);
      console.log('task queue running: ', taskQueue.running(), ' waiting: ', taskQueue.length());
      throw e;
    }
  }

  protected getConditionSql({
    beginDate,
    endDate,
    categoryId,
    pagePath,
    where,
    groupBy,
  }: {
    beginDate: Date;
    endDate: Date;
    categoryId?: string;
    pagePath?: string;
    where?: string;
    groupBy?: string;
  }): string {
    return `
    from ${this.getTableName('t_log_details')}
    where
      eventTimestamp >= toDateTime('${+beginDate / 1000}')
      and eventTimestamp <= toDateTime('${+endDate / 1000}')
      ${categoryId ? `and categoryId='${categoryId}'` : ''}
      ${pagePath ? `and pagePath='${pagePath}'` : ''}
      ${where ? `and ${where}` : ''}
    group by toStartOfInterval(eventTimestamp, interval 1 minute)
    ${groupBy ? `,${groupBy}` : ''}
    order by toStartOfInterval(eventTimestamp, interval 1 minute) asc`;
  }

  protected fillGapDurations(
    {
      beginDate,
      endDate,
      interval,
      createItem = (time: number) => ({ time, value: 0 }),
    }: {
      beginDate: Date;
      endDate: Date;
      interval: Interval;
      createItem?: (time: number) => any;
    },
    data: Array<any>,
  ): Array<any> {
    const unitType = interval.substr(-1) as dayjs.OpUnitType;
    const begin = dayjs(roundTime(beginDate, interval));
    const end = dayjs(roundTime(endDate, interval));
    const result: Array<any> = [];
    const unit = parseInt(interval, 10);
    for (let i = begin, k = 0; !i.isAfter(end); i = i.add(unit, unitType)) {
      const unixTimstamp = i.unix() as Timestamp;
      if (data[k] && data[k].time === unixTimstamp) {
        result.push(data[k]);
        k++;
      } else {
        result.push(createItem(unixTimstamp));
      }
    }
    return result;
  }

  protected createBizError(code: number, msg: string) {
    const err = new Error(msg);
    // @ts-ignore
    err.code = code;
    throw err;
  }
}