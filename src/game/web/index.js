
module.exports = (res, path) => {
  res.writeHead(200, { 'Content-Type': 'text/json' });
  res.end(JSON.stringify({
    code: 1024,
  }));
};
