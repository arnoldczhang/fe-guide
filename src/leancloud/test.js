const request = require('request');
require('leancloud-realtime');
const AV = require('leancloud-storage');

const APP_ID = 'vafCyMAD1WAc7wqi30cap3Vq-gzGzoHsz';
const APP_KEY = '5g2MFdEzshuUlIIeguw4ReCn';

AV.init({
  appId: APP_ID,
  appKey: APP_KEY
});


const User = AV.Object.extend('user');

const updateOrInsert = () => {
  const query = new AV.Query('user');
  query.equalTo('openid', '1223j9219j31b23ji');
  query.find().then((res) => {
    let user = res[0];
    if (user) {
      user.save({
        words: 'aaaadsd',
      }).then((us) => {
        console.log(us);
      });
    } else {
      user = new User();
      user.save({
        words: 'Hello World!',
        openid: '1223j9219j31b23ji',
      }).then((o) => {
        console.log('LeanCloud Rocks!');
      });
    }
  }).catch((err) => {

  });
};

updateOrInsert();
