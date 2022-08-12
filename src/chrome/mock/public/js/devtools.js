chrome.devtools.panels.create(
  'mock',
  'icons/16-enabled.png',
  'index.html', function(panel) {
	console.log('自定义面板创建成功！'); // 注意这个log一般看不到
});
