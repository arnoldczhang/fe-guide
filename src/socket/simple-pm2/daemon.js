const rpcServer = require('./rpc-server');
let cachFn;

const onReady = () => {
    const stdout = fs.createWriteStream(path.join(__dirname, 'log.json'), { flags : 'a' });

    process.stderr.write = (function(write) {
        return function(string, encoding, fd) {
          stdout.write(JSON.stringify([(new Date()).toISOString(), string]));
        };
      }
    )(process.stderr.write);

    process.stdout.write = (function(write) {
      return function(string, encoding, fd) {
        stdout.write('\n' + JSON.stringify([(new Date()).toISOString(), string]));
      };
    })(process.stdout.write);

  if (!process.env.SLAVE) {
    const rpc = require('axon-rpc');
    const axon = require('axon');
    const rep = axon.socket('rep');
    const server = new rpc.Server(rep);
    rep.bind(6666, 'localhost');
    console.log('rpc server started at 6666');

    server.expose({
      prepare: function(fn){
        console.log('rpc connected');
        cachFn = fn;
        rpcServer(fn);
      },
      stop(fn) {
        console.log('rpc disconnectd');
        cachFn = fn;
        rpcServer(fn, 'close');
      },
    });
  } else {
    delete process.env.SLAVE;
    rpcServer(cachFn);
  }
};

onReady();
 
