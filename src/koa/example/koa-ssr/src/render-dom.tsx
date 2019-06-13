import * as React from "react";
import { renderToString } from "react-dom/server";
import { StaticRouter } from "react-router-dom";
import { Provider as ReduxProvider } from "react-redux";
import Layout from "./components/Layout";
import { IncomingMessage } from "http";

const getRenderDom = (context: any, req: IncomingMessage, store): string => renderToString(
  <ReduxProvider store={store}>
    <StaticRouter context={context} location={req.url}>
      <Layout />
    </StaticRouter>
  </ReduxProvider>
);

export default getRenderDom;
