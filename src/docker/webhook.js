const { spawn, exec } = require('child_process');

const http = require('http');
const request = require('request');
const querystring = require('querystring');

const Authorization = 'Authorization';
const url = 'http://test';

/**
 * 调用Alerts告警
 * @param {IncomingMessage} req 
 * @param {ServerResponse} res 
 */
const sendWarning = (req, res) => {
  let body = "";
  req.on('data', (chunk) => {
    body += chunk;
  });

  req.on('end', () => {
    body = querystring.parse(body);
    res.writeHead(200,{'Content-Type':'text/javascript'});
    let [ content ] = Object.keys(body);
    request({
      url,
      method: 'POST',
      json: true,
      headers: {
        "Content-Type": "application/json",
        Authorization,
      },
      body: {
        source: 10,
        content: 'tstttss',
        level: 2,
        send_to_users: ['zc'],
      },
    }, (err, resp, bd) => {
      console.log('已发送告警');
    });
    res.end();
  });
};

/**
 * 新增规则
 * @param {IncomingMessage} req 
 * @param {ServerResponse} res 
 */
const insertNewRule = (req, res) => {

};

/**
 * 重启普罗米修斯
 * @param {IncomingMessage} req 
 * @param {ServerResponse} res 
 */
const restartPrometheus = (req, res) => {
  exec('docker restart prometheus', (err, stdout) => {
    console.log(err, stdout);
  });
};

const startServer = () => http.createServer((req, res) => {//回调函数
  const { url } = req;
  switch (url) {
    case '/aoi':
      sendWarning(req, res);
      break;
    case '/restart':
      insertNewRule(req, res);
      restartPrometheus(req, res);
      break;
    default:
      break;
  }
}).listen(8888);

// webhook server
startServer();
