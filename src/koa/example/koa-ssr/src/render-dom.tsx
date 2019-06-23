import * as React from "react";
import { renderToString } from "react-dom/server";
import { StaticRouter } from "react-router-dom";
import { Provider as ReduxProvider } from "react-redux";
import Layout from "./components/Layout";
import { IncomingMessage } from "http";
import { Store } from "redux";

const getRenderDom = (context: any, req: IncomingMessage, store: Store): string => renderToString(
  <ReduxProvider store={store}>
    <StaticRouter context={context} location={req.url}>
      <Layout />
    </StaticRouter>
  </ReduxProvider>
);

export default getRenderDom;
