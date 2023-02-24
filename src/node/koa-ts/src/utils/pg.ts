import 'reflect-metadata';

import { createConnection } from 'typeorm';
import { SnakeNamingStrategy } from 'typeorm-naming-strategies';
import { AppManagement } from '../typeorm/entity/AppManagement';
import { getPGConfig } from './helper';
import config from '../config';
import { LighthouseDetail } from '../typeorm/entity/LighthouseDetail';
import { ChangeEvent } from '../typeorm/entity/ChangeEvent';
import { DailyReport } from '../typeorm/entity/DailyReport';
import { PerfDetail } from '../typeorm/entity/PerfDetail';
import { LighthouseTask } from '../typeorm/entity/LighthouseTask';
import { MinicodeBuild } from '../typeorm/entity/MinicodeBuild';

const connectionPromise = getPGConfig(config.pgInfo).then((pgConfig) => createConnection(
  Object.assign((pgConfig || {}), {
    type: 'postgres',
    synchronize: false,
    logging: false,
    namingStrategy: new SnakeNamingStrategy(),
    entities: [LighthouseTask, LighthouseDetail, ChangeEvent, DailyReport, PerfDetail, AppManagement, MinicodeBuild]
  })
));

export {
  connectionPromise, LighthouseTask, LighthouseDetail, ChangeEvent, DailyReport, PerfDetail, AppManagement, MinicodeBuild
};
