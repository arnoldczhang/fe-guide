// process.binding引用built-in模块
// const buffer = process.binding('buffer');
// const buffer2 = require('buffer');


// let a = {x:1, y:2, z:3};

// let b = {};
// b.x = 1;
// b.y = 2;
// b.z = 3;

// console.log("a is", a);
// console.log("b is", b);
// console.log("a and b have same map:", %HaveSameMap(a, b));

// let c = Object.assign({}, {x:1, y:2, z:3});
// let d = Object.assign({}, c);
// console.log("c is", c);
// console.log("d is", d);
// console.log("c and d have same map:", %HaveSameMap(c, d)); // true

// console.log(process.cwd());


const cluster = require('cluster');
const http = require('http');
const numCPUs = require('os').cpus().length;

if (cluster.isMaster) {
  console.log(`主进程 ${process.pid} 正在运行`);

  // 衍生工作进程。
  for (let i = 0; i < numCPUs; i++) {
    cluster.fork();
  }

  cluster.on('exit', (worker, code, signal) => {
    console.log(`工作进程 ${worker.process.pid} 已退出`);
  });
} else {
  // 工作进程可以共享任何 TCP 连接。
  // 在本例子中，共享的是一个 HTTP 服务器。
  http.createServer((req, res) => {
    res.writeHead(200);
    res.end('你好世界\n');
  }).listen(8000);

  console.log(`工作进程 ${process.pid} 已启动`);
}
