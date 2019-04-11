import path from 'path';
import fs from 'fs';
import express from 'express';
import React, { DomFrag } from 'react';
import ReactDOMServer from 'react-dom/server';

class App extends React.Component {
  constructor() {
    super();
  }

  render() {
    return (
      <div> hello world </div>
    );
  }
}

const PORT = 8080;
const app = express();

const router = express.Router();

const serverRenderer = (req, res, next) => {
  fs.readFile(path.join(__dirname, './index.html'), 'utf8', (err, data) => {
    debugger;
    if (err) {
      console.error(err)
      return res.status(500).send('An error occurred')
    }
    return res.send(
      data.replace(
        '<div id="root"></div>',
        `<div id="root">${ReactDOMServer.renderToString(<App />)}</div>`
      )
    )
  });
}
router.use('^/$', serverRenderer);

router.use(
  express.static(path.resolve(__dirname, '.', 'build'), { maxAge: '30d' })
);

app.use(router);

app.listen(PORT, () => {
  console.log(`SSR running on port ${PORT}`);
});