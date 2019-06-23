"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const path = require("path");
const react_helmet_1 = require("react-helmet");
const utils_1 = require("./utils");
const render_dom_1 = require("./render-dom");
const store_1 = require("./store");
const Koa = require("koa");
const body = require("koa-body");
const logger = require("koa-logger");
const compress = require("koa-compress");
const Router = require("koa-router");
const staticServer = require("koa-static");
const webpack = require("webpack");
const webpackDevMiddleware = require("koa-webpack-dev-middleware");
const webpackHotMiddleware = require("koa-webpack-hot-middleware");
const webpack_config_1 = require("../webpack.config");
const dev = process.env.NODE_ENV === "development";
const app = new Koa();
const router = new Router();
const port = 2048;
webpack_config_1.default.entry.app = [
  `webpack-hot-middleware/client?path=//localhost:${port}/__webpack_hmr`,
  webpack_config_1.default.entry.app
];
webpack_config_1.default.output.hotUpdateMainFilename =
  "updates/[hash].hot-update.json";
webpack_config_1.default.output.hotUpdateChunkFilename =
  "updates/[id].[hash].hot-update.js";
if (dev) {
  const watchOptions = {
    ignored: /node_modules/,
    stats: webpack_config_1.default.stats
  };
  const compiler = webpack([webpack_config_1.default]);
  app.use(
    webpackDevMiddleware(compiler, {
      publicPath: webpack_config_1.default.output.publicPath,
      stats: webpack_config_1.default.stats,
      watchOptions
    })
  );
  app.use(webpackHotMiddleware(compiler));
}
router.get("/*", (ctx, next) => {
  const context = {};
  const { req } = ctx;
  const store = store_1.default();
  try {
    store.dispatch(store_1.initializeSession());
    const reactDom = render_dom_1.default(context, req, store);
    const reduxState = store.getState();
    const helmetData = react_helmet_1.default.renderStatic();
    ctx.status = 200;
    ctx.set("Content-Type", "text/html");
    ctx.body = utils_1.htmlTemplate(reactDom, reduxState, helmetData);
  } catch (err) {
    console.log(err);
    next();
  }
});
app
  .use((ctx, next) => {
    ctx.set("Access-Control-Allow-Origin", "*");
    return next();
  })
  .use(staticServer(path.resolve(__dirname, "../dist")))
  .use(body())
  .use(logger())
  .use(compress())
  .use(router.routes())
  .use(router.allowedMethods())
  .listen(port, () => console.log(`listening on port ${port}`));
