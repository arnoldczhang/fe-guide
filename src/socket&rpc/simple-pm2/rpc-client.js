const rpc = require('axon-rpc');
const axon = require('axon');
const req = axon.socket('req');
 

var client = new rpc.Client(req);
req.connect(6666);

const cmd = process.argv[2];

if (cmd === '-s') {
  client.call('stop', function(err, cluster){
    if (!err) {
      console.log('Process disconnectd');
      process.exit(0);
    }
  });
} else {
  client.call('prepare', function(err, cluster){
    if (!err) {
      console.log('Process connectd');
      process.exit(0);
    }
  });
}

