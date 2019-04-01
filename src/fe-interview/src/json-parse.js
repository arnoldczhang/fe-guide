// 解法1 eval
eval('(' + jsonstring + ')');

// 解法2 new Function
(new Function('return ' + jsonstring))();

// 解法3 状态机
// https://github.com/youngwind/blog/issues/115