"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Koa = require("koa");
const internalIP = require("internal-ip");
const path = require("path");
const body = require("koa-body");
const logger = require("koa-logger");
const compress = require("koa-compress");
const staticServer = require("koa-static");
const router = require("./router");
const app = new Koa();
const host = internalIP.v4() || '0.0.0.0';
const port = 3000;
app.use(staticServer(path.join(__dirname, './public')))
    .use(body())
    .use(logger())
    .use(compress())
    .use(router.routes())
    .use(router.allowedMethods());
app.listen(port, () => {
    console.log(`koa app start at port ${port}`);
});
