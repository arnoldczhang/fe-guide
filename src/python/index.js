// node 7.8 / python 2.8
const exec = require('child_process').exec;
const fs = require('fs');
const schedule = require('node-schedule');

const basePath = './src/python/';
const rule = new schedule.RecurrenceRule();
rule.second = 0;

const batchJob = schedule.scheduleJob(rule, function(){
  console.log(new Date);
  exec(`python ${basePath}index.py ${basePath}`, (err, stdout, stderr) => {
    if (err) {
      console.log('stderr',err);
    } else {
      // console.log(fs.readFileSync(`${outputUrl}`, 'utf8'));
    }
  });
});


