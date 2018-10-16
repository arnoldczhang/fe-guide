const { createServer } = require('http');
const { parse } = require('url');
const next = require('next');
const handleBackendRequest = require('./web');

const dev = process.env.NODE_ENV !== 'production';
const app = next({
  dev,
  dir: './src/',
});
const handle = app.getRequestHandler();

app.prepare().then(() => {
  createServer((req, res) => {
    const parsedUrl = parse(req.url, true);
    const { pathname, query } = parsedUrl;

    if (/^\/rest/.test(pathname)) {
      res.writeHead(200, { 'Content-Type': 'text/json' });
      handleBackendRequest(res, pathname);
    } else {
      handle(req, res, parsedUrl);
    }
  }).listen(3000, err => {
    if (err) throw err
    console.log('> Ready on http://localhost:3000')
  });
});