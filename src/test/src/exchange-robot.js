const http = require('http');
const nodemailer  = require("nodemailer");
const jsdom = require("jsdom");
const {
  interval,
  threshold,
} = require('./config');
const { JSDOM } = jsdom;
const exchange = [];

const sendMail = () => {
  const smtpTransport = nodemailer.createTransport({
    service: 'smtp.163.com',
    host: "smtp.163.com",
    secureConnection: true,
    port:465,
    auth:{
      user:'发件人邮箱',
      pass:'密码'
    },
  });
  smtpTransport.sendMail({
      from: '发件人邮箱',
      to: '收件人邮箱，多个邮箱地址间用','隔开',
      subject: 'title',//邮件主题
      text: 'Hello world!'//text和html两者只支持一种
  }, function(err, res) {
      console.log(err, res);
  });
};

const validateExchange = () => {
  Object.keys(threshold).forEach((currency) => {
    exchange.forEach((item) => {
      const { 币种, } = item;
      if (币种.indexOf(currency) > -1) {
        threshold[currency];
      }
    });
  });
};

const parseHtml = (input = '') => {
  const { window } = new JSDOM(input);
  const $ = require('jQuery')(window);
  $('#form1 .tableDataTable > tbody tr').each((index, outel) => {
    const [
      currency,
      exchangeSpotBuyPrice,
      exchangeCashBuyPrice,
      exchangeSpotSellPrice,
      exchangeCachSellPrice,
      time,
    ] = $(outel).find('td');
    exchange[index] = {
      币种: currency.innerHTML,
      现汇买入价: exchangeSpotBuyPrice.innerHTML,
      现钞买入价: exchangeCashBuyPrice.innerHTML,
      现汇买出价: exchangeSpotSellPrice.innerHTML,
      现钞买出价: exchangeCachSellPrice.innerHTML,
      时间: time.innerHTML,
    };
  });
  validateExchange();
};

const requestExchange = () => {
  const req = http.request({
    hostname: 'www.icbc.com.cn',
    port: 80,
    path: '/ICBCDynamicSite/Optimize/Quotation/QuotationListIframe.aspx',
    method: 'GET',
    headers: {
    },
  }, (res) => {
    res.setEncoding('utf8');
    res.on('data', (chunk) => {
      parseHtml(chunk);
    });
    res.on('end', () => {
    });
  });
  
  req.on('error', (e) => {
    console.error(`请求遇到问题: ${e.message}`);
  });
  
  req.end();
};

requestExchange();