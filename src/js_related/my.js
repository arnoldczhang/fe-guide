// 强制清浏览器缓存
const ifr = document.createElement('iframe');
ifr.name = ifr.id = 'ifr_'+Date.now();
document.body.appendChild(ifr);
const form = document.createElement('form');
form.method = "POST";
form.target = ifr.name;
form.action = '/thing/stuck/in/cache';
document.body.appendChild(form);
form.submit();
document.body.removeChild(ifr);
document.body.removeChild(form);




// 正则转义字符
* . ? + $ ^ [ ] ( ) { } | \ /





//https证书
openssl genrsa 1024 > ./ssl/private.pem
openssl req -new -key ./ssl/private.pem -out csr.pem
openssl x509 -req -days 365 -in csr.pem -signkey ./ssl/private.pem -out ./ssl/file.crt





// indexOf VS search
search:默认处理正则，比如'aaa\n'.search('.')，是0，因为/./
indexOf:处理字符串，同是字符串，略快





// 0.1 + 0.2 !== 0.3 
// 计算机中存储小数是先转换成二进制进行存储
// 
// 53位存储位
// 
// (0.1)10 => (00011001100110011001(1001)...)2
// (0.2)10 => (00110011001100110011(0011)...)2




// isObject
// 类似new String('aa')，不算
function isProxyable(value) {
  if (!value) return false;
  if (typeof value !== "object") return false;
  if (Array.isArray(value)) return true;
  const proto = Object.getPrototypeOf(value);
  return proto === null || proto === Object.prototype;
}




// ajax
readystate
0：请求未初始化（还没有调用 open()）。
1：请求已经建立，但是还没有发送（还没有调用 send()）。
2：请求已发送，正在处理中（通常现在可以从响应中获取内容头）。
3：请求在处理中；通常响应中已有部分数据可用了，但是服务器还没有完成响应的生成。
4：响应已完成；您可以获取并使用服务器的响应了。




// Object.getOwnPropertyDescriptor
var obj = {};
Object.defineProperty(obj, aa, {
  get() {/*...*/},
  set() {/*...*/},
});

Object.getOwnPropertyDescriptor(obj);
/*
  {
    get(){},
    set(){},
    configurable: true,
    enumerable: true,
  }
*/




