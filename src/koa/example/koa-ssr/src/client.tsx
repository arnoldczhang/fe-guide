import * as React from "react";
import { hydrate } from "react-dom";
import { BrowserRouter as Router } from "react-router-dom";
import { Provider as ReduxProvider } from "react-redux";

import Layout from "./components/Layout";
import createStore from "./store";

const store = createStore((window as any).REDUX_DATA);

const jsx = (
  <ReduxProvider store={store}>
    <Router>
      <Layout />
    </Router>
  </ReduxProvider>
);

const app = document.getElementById("app");
hydrate(jsx, app);

if (process.env.NODE_ENV === "development") {
  if ((module as any).hot) {
    (module as any).hot.accept();
  }

  if (!(window as any).store) {
    (window as any).store = store;
  }
}
