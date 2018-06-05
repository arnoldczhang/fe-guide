import * as Koa from 'koa';
import * as open from 'open';
import * as internalIP from 'internal-ip';
import * as path from 'path';
import * as body from 'koa-body';
import * as logger from 'koa-logger';
import * as compress from 'koa-compress';
import * as staticServer from "koa-static";
import * as fs from 'fs';

import * as router from './router';

const app: Koa = new Koa();
const host: string = internalIP.v4() || '0.0.0.0';
const port: number = 3000;

app.use(staticServer(path.join(__dirname, './public')))
  .use(body())
  .use(logger())
  .use(compress())
  .use(router.routes())
  .use(router.allowedMethods());

app.listen(port, (): void => {
  console.log(`koa app start at port ${port}`);
  // open(`http://${host}:${port}`);
});
