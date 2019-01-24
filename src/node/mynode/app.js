const express = require('express');
const request = require('request');

const app = express();

app.get('/user', function(req, res) {
  res.status(200).json({ name: 'tobi' });
});
 
app.listen(3000);

request({
  url: 'http://localhost:3000/user',
}, (res) => {
  console.log(res);
});