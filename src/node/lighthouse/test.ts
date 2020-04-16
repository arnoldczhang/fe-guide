import Lighthouse from './index';

const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const toHash = (input = ''): string => crypto.createHash('md5').update(input).digest('hex');

async function test(url: string): Promise<any> {
  const lighthouse = new Lighthouse(url);
  const report = await lighthouse.run();
  fs.writeFileSync(path.join(__dirname, './test-2.json'), report.getJson(), 'utf-8');
  fs.writeFileSync(path.join(__dirname, './test-2.html'), report.getHtml(), 'utf-8');
}

test();
