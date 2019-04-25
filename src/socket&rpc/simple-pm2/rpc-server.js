const cluster = require('cluster');
const p = require('path');
const http = require('http');
const numCPUs = require('os').cpus().length;

let nextId = 0;
const God = {
  clusters_db: {},
};

module.exports = (cb, tag) => {
  if (tag === 'close') {
    Object.values(God.clusters_db).forEach(clu => clu.disconnect());
    cb();
  } else {
    if (cluster.isMaster) {
      console.log(`主进程 ${process.pid} 正在运行`);
      for (let i = 0; i < numCPUs; i++) {
        let clu = cluster.fork({
          SLAVE: true,
        });
        God.clusters_db[clu.id] = clu;
        if (i === numCPUs - 1) {
          cb();
        }
      }

      cluster.on('exit', (worker, code, signal) => {
        console.log(`工作进程 ${worker.process.pid} 已退出`);
        delete God.clusters_db[worker.id];
        // if (!Object.keys(God.clusters_db).length) {
        //   process.exit(0);
        // }
      });
    } else {
      http.createServer(function(pid) {
        console.log(`子进程 ${pid} 已启动`);
        return function(req, res) {
          res.writeHead(200);
          res.end("hello world\n" + 'port: ' + pid);
        };
      }(process.pid)).listen(8000);
    }
  }
};









