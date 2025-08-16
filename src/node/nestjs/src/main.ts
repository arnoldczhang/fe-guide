import { NestFactory } from '@nestjs/core';
import { connection, connect } from 'mongoose';
import { NestExpressApplication } from '@nestjs/platform-express';
import { AppModule } from './app.module';
import { config } from './const/config';
import { cpus } from 'os';
import { fork } from 'child_process';

const bootstrap = () => {
  connection
    .on('error', console.log)
    .on('disconnected', bootstrap)
    .once('open', runTask);
  return connect(config.dab, {
    keepAlive: true,
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
};

const runJob = () => {
  const worker = fork('./src/utils/cypress.js');
  worker.on('exit', () => {
    setTimeout(runJob, 5000);
  });
};

const runDispatch = () => {
  const cpuList = cpus();
  runJob();
  // for (let i = 0, len = cpuList.length; i < len; i++) {
  //   setTimeout(runJob, 5000);
  // }
};

const runTask = () => {
  runDispatch();
  startServer();
};

const startServer = async () => {
  console.log('starting server');
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  app.enableCors();
  app.useStaticAssets('cypress');
  await app.listen(config.port, () => {
    console.log(`server start at port: ${config.port}`);
  });
};

bootstrap();
