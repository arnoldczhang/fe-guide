# chrome插件开发

## 参考

- [jsAPI](https://crxdoc-zh.appspot.com/extensions/api_index)
- [headless-recorder](https://github.com/checkly/headless-recorder/tree/master/src)
- [cypress-recorder-for-vue](https://github.com/oscartavarez/cypress-recorder/tree/master/src)
- [cypress-recorder-for-react](https://github.com/KabaLabs/Cypress-Recorder)
- [chrome官方指南](https://developer.chrome.com/docs/extensions/reference/tabs/#get-the-current-tab)
- [chrome插件开发全攻略](https://www.bookstack.cn/read/chrome-plugin-develop/spilt.1.8bdb1aac68bbdc44.md)
- [比较水的chrome插件开发指南](https://mp.weixin.qq.com/s/15bg0E2rqr8BEZId_YlJbQ)



## 一些配置

### chrome隐私
thisisunsafe

> `chrome://flags`里面

- [iframe的cookie跨域问题](https://segmentfault.com/a/1190000039706607)

默认对 same-site cookie有比较严格的限制，只能通过开发者选项绕过

---

## API

### IdleDetector

检测用户是否正在发呆（即没有任何操作）