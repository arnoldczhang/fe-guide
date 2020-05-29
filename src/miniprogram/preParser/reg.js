const webpackCommentRE = /\/\*{3}\/\s+("[^"]+"):\s+\/\*\![\*\\\/\!\s\w\.\?\=\(\)\$@_\-]+\*\/\s+\/\*\!\s[^*]+\s\*\/\s+\/\*{3}\/\s+/g;

const myRE = /(?:_|)my(?:\d+|)/;

exports.webpackCommentRE = webpackCommentRE;

exports.myRE = myRE;
