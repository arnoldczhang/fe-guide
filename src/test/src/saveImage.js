// npm run save http://baidu.com/img /images
const https = require('https');
const fs = require('fs');
const filepath = process.argv[2];
const savepath = process.argv[3] || 'images';
const randomName = () => String(Math.random().toString(36)).substr(2);

if (filepath) {
  https.get(filepath, (res) => {
    let rawData = '';
    res.setEncoding('binary');
    res.on('data', (chunk) => {
      if (res.statusCode === 200) {
        rawData += chunk;
      }
    });

    res.on('end', () => {
      const {
        headers,
      } = res;
      const type = headers['content-type'];
      const suffix = type.replace(/image\/(.+)/, '$1');
      const buffer = new Buffer(rawData, 'binary').toString('base64');
      const filename = ((headers['content-disposition'] || '').replace(/.+filename="([^'"]+)".+/, '$1') || randomName()) + `.${suffix}`;

      fs.writeFile(`${savepath.replace(/\/+$/, '')}/${filename}`, buffer, 'base64', (err) => {
        if (err) {
          console.error(err);
        } else {
          console.log(`${filename} save succes`);
        }
      });
    });
  });
} else {
  console.error('`arv[2]` as filename is needed');
}

