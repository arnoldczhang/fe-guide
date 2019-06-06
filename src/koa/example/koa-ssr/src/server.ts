import * as path from "path";
import { renderToString } from "react-dom/server";
import { StaticRouter } from "react-router-dom";
import { Provider as ReduxProvider } from "react-redux";
import * as Helmet from "react-helmet";
import { htmlTemplate }  from "./utils";
import Layout from "./components/Layout";
import createStore, { initializeSession } from "./store";

import * as Koa from "koa";
import * as body from "koa-body";
import * as logger from "koa-logger";
import * as compress from "koa-compress";
import * as Router from "koa-router";
import * as staticServer from "koa-static";

import * as webpack from "webpack";
import webpackDevMiddleware from "koa-webpack-dev-middleware";
import webpackHotMiddleware from "koa-webpack-hot-middleware";
import webpackConfig from "../webpack.config";

const { htmlTemplate } = Utils;
const dev = process.env.NODE_ENV === "development";
const app = new Koa();
const router = new Router();
const port = 2048;

webpackConfig.entry.app = [
  `webpack-hot-middleware/client?path=//localhost:${port}/__webpack_hmr`,
  webpackConfig.entry.app
];
webpackConfig.output.hotUpdateMainFilename = "updates/[hash].hot-update.json";
webpackConfig.output.hotUpdateChunkFilename =
  "updates/[id].[hash].hot-update.js";

if (dev) {
  const watchOptions = {
    ignored: /node_modules/,
    stats: webpackConfig.stats
  };

  const compiler = webpack([webpackConfig]);

  app.use(
    webpackDevMiddleware(compiler, {
      publicPath: webpackConfig.output.publicPath,
      stats: webpackConfig.stats,
      watchOptions
    })
  );

  app.use(webpackHotMiddleware(compiler));
}

router.get("/*", async (ctx, next) => {
  const context = {};
  const { req } = ctx;
  const store = createStore();

  try {
    store.dispatch(initializeSession());
    const jsx = (
      <ReduxProvider store={store}>
        <StaticRouter context={context} location={req.url}>
          <Layout />
        </StaticRouter>
      </ReduxProvider>
    );
    const reactDom = renderToString(jsx);
    const reduxState = store.getState();
    const helmetData = Helmet.renderStatic();

    ctx.status = 200;
    ctx.set("Content-Type", "text/html");
    ctx.body = htmlTemplate(reactDom, reduxState, helmetData);
  } catch (err) {
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
  .listen(port, () => console.log(`development is listening on port ${port}`));
