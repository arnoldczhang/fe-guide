"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Koa = require("koa");
var internalIP = require("internal-ip");
var path = require("path");
var body = require("koa-body");
var logger = require("koa-logger");
var compress = require("koa-compress");
var staticServer = require("koa-static");
var router = require("./router");
var app = new Koa();
var host = internalIP.v4() || '0.0.0.0';
var port = 3000;
app.use(staticServer(path.join(__dirname, './public')))
    .use(body())
    .use(logger())
    .use(compress())
    .use(router.routes())
    .use(router.allowedMethods());
app.listen(port, function () {
    console.log("koa app start at port " + port);
});
