import AbstractService, { MetricItem } from './AbstractService';

import 'reflect-metadata';
import { connectionPromise, PerfDetail } from '../utils/pg';
import { SnakeNamingStrategy } from 'typeorm-naming-strategies';

type queryParams = {
  isDelete?: boolean,
  testName: string,
  fileUrl: string,
  branchName: string,
  commitId: string,
  authorName: string,
  batchId: string,
  endTime: Date,
}


export default class PerfDetailService extends AbstractService {
  async saveRecord(params: queryParams): Promise<any> {
    const connection = await connectionPromise;
    const record = new PerfDetail();
    record.testName = params.testName;
    record.fileUrl = params.fileUrl;
    record.branchName = params.branchName;
    record.commitId = params.commitId;
    record.authorName = params.authorName;
    record.batchId = params.batchId;
    record.endTime = new Date(params.endTime);
    await connection.manager.save(record);
  }

  async getAll(): Promise<any> {
    const connection = await connectionPromise;
    const records = await connection.manager.find(PerfDetail,
      {
        order: {
          createTime: 'DESC'
        }
      });
    return records;
  }

  async last(): Promise<any> {
    const connection = await connectionPromise;
    const record = await connection.manager.findOne(PerfDetail,
      {
        order: {
          createTime: 'DESC'
        }
      });
    return record;
  }

  async getDataByBatchId(batchId: string): Promise<any> {
    const connection = await connectionPromise;
    const record = await connection.manager.findOne(PerfDetail,
      {
        where: {
          batchId
        }
      });
    return record;
  }
}
