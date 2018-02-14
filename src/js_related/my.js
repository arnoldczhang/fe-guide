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
