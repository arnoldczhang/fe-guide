
module.exports = {
  'Basic e2e Test'(browser) {
    browser
      .url('http://so.com') // 打开 so.com 网页
      .waitForElementVisible('body') // 确认能看到 body 元素
      .setValue('#input', 'Nightwatch') // 在搜索框输入 Nightwatch
      .click('#search-button') // 点击搜索
      .pause(1000) // 等待1秒钟
      .assert.containsText('#container', 'Nightwatch') // 查询结果包含 Nightwatch
      .end();
  },
};
