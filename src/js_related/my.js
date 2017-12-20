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