// @ts-nocheck
import ClickHouse = require('@apla/clickhouse');
import { queueQuery, taskQueue } from './clickhouse';
import config from '../config';
config.queryQueueSize = 5;

const dbQuerys = {};
describe('queueQuery', () => {
  ClickHouse.prototype.querying = jest.fn((sql: string) => {
    return new Promise((resolve, reject) => {
      if (sql.indexOf('reject') >= 0) {
        dbQuerys[sql] = reject;
      } else {
        dbQuerys[sql] = resolve;
      }
    });
  });

  function dbExecute(sql) {
    dbQuerys[sql]({ data: 'result ' + sql });
  }

  // async.queue是异步启动任务的
  function taskStart() {
    return new Promise(resolve => setTimeout(resolve, 0));
  }
  test('it must wait until queue is available', async () => {
    const sqls = [];
    for (let i = 0; i < 6; i++) {
      sqls.push('select ' + i);
    }
    const querys = sqls.map(queueQuery);
    await taskStart();
    expect(ClickHouse.prototype.querying).toHaveBeenCalledTimes(5);
    expect(taskQueue.running()).toBe(5);
    expect(taskQueue.length()).toBe(1);
    dbExecute('select 0');
    await taskStart();
    expect(ClickHouse.prototype.querying).toHaveBeenCalledTimes(6);
    expect((await querys[0]).data).toBe('result select 0');
    dbExecute('select 1');
    expect(ClickHouse.prototype.querying).toHaveBeenCalledTimes(6);
    dbExecute('select 5');
    expect(ClickHouse.prototype.querying).toHaveBeenCalledTimes(6);
    expect((await querys[5]).data).toBe('result select 5');
    expect(taskQueue.running()).toBe(3);

    // 新插入一个异常查询
    querys.push(queueQuery('select reject 6'));
    await taskStart();
    expect(ClickHouse.prototype.querying).toHaveBeenCalledTimes(7);
    dbExecute('select reject 6');
    try {
      await querys[6];
    } catch (e) {
      expect(e).toEqual({ data: 'result select reject 6' });
    }

    // 新插入一个查询
    querys.push(queueQuery('select 7'), queueQuery('select 8'));
    await taskStart();
    expect(ClickHouse.prototype.querying).toHaveBeenCalledTimes(9);
    dbExecute('select 8');
    expect((await querys[8]).data).toBe('result select 8');
    expect(taskQueue.running()).toBe(4);
  });
});
