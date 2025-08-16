import { AsyncResultCallback } from 'async';

import config from '../config';

import ClickHouse = require('@apla/clickhouse');
import queue = require('async/queue');

const house = new ClickHouse(config.clickhouse);
export const taskQueue = queue<string, QueryResult<any>>(
  (sql: string, callback: AsyncResultCallback<QueryResult<any>>) => {
    query<any>(sql).then(
      (result) => {
        callback(null, result);
      },
      (reason) => {
        callback(reason);
      },
    );
  },
  config.queryQueueSize,
);

export interface QueryResult<T> {
  meta: Array<{ name: string; type: string }>;
  data: Array<T>;
  rows: number;
  statistics: {
    elapsed: number;
    rows_read: number;
    bytes_read: number;
  };
  transferred: number;
}

export async function query<T>(sql: string): Promise<QueryResult<T>> {
  const result = await house.querying(sql);
  return result as QueryResult<T>;
}

export async function queueQuery<T>(sql: string): Promise<QueryResult<T>> {
  return new Promise((resolve, reject) => {
    taskQueue.push<QueryResult<T>>(sql, (error, result) => {
      if (error != null) {
        reject(error);
      } else {
        resolve(result);
      }
    });
  });
}
