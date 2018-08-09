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



// JSON.stringify
//如果对象中定义了 toJSON() 方法，JSON 字符串化时会首先调用该方法，然后用它的返回 值来进行序列化。





// valueOf和toString
//类型转换时，如果Object含有valueOf或toString，则调用valueOf()方法，然后通过ToString抽象 操作将返回值转换为字符串





// this
//(1)函数是否在new中调用(new绑定)?如果是的话this绑定的是新创建的对象。
var bar = new foo();
//(2)函数是否通过call、apply(显式绑定)或者硬绑定调用?如果是的话，this绑定的是 指定的对象。
var bar = foo.call(obj2);
var bar2 = foo.apply(obj2);
var bar3 = foo.bind(obj2);
//(3)函数是否在某个上下文对象中调用(隐式绑定)?如果是的话，this 绑定的是那个上 下文对象。
var bar = obj1.foo();
//(4)如果都不是的话，使用默认绑定。如果在严格模式下，就绑定到undefined，否则绑定到 全局对象。
var bar = foo();





// +是相加还是拼接
//（1）操作数是string，做拼接，否则做相加；
//（2）操作数是object，做toPrimitive（valueOf或toString），再按（1）判断；





// ==和===
// == 允许在相等比较中进行强制类型转换，而 === 不允许。
var a = 42;
var b = "42";

a == b; //true

// 字符串和数字之间的相等比较
// （1） 如果 Type(x) 是数字，Type(y) 是字符串，则返回 x == ToNumber(y) 的结果。 
// （2）如果 Type(x) 是字符串，Type(y) 是数字，则返回 ToNumber(x) == y 的结果。
// （3）否则返回 ToBoolean(x) == ToBoolean(y)的结果。

// 对象和非对象之间的相等比较
// （1）如果 Type(x) 是字符串或数字，Type(y) 是对象，则返回 x == ToPrimitive(y) 的结果；
// （2）如果 Type(x) 是对象，Type(y) 是字符串或数字，则返回 ToPromitive(x) == y 的结果；
// 注：ToPromitive默认转数字；




// 在 ES6 中，如果参数被省略或者值为 undefined，则取该参数的默认值




// 函数声明不可以省略函数名



//ES5 对象的扩展(Object.preventExtensions)、密封(Object.seal)和冻结(Object.freeze)
http://www.cnblogs.com/snandy/p/5278474.html





// 删除不需要的属性
const obj = {
  a: 1,
  b: 2,
  c: 3,
  d: 4,
};

const {
  a,
  b,
  ...cleanObject,
} = obj;

console.log(cleanObject);



// 合并对象
const obj = {
  a: 1,
  b: 2,
};

const obj2 = {
  c: 3,
  d: 4,
};

const obj3 = {...obj, ...obj2};
console.log(obj3);


// 使用Set实现数组去重
let arr = [1, 1, 2, 2, 3, 3];
let deduped = [...new Set(arr)];




// 接收函数返回的多个结果
// 只要一个结果是reject就进error
async function getFullPost() {
  return await Promise.all([
    fetch('/aa'),
    fetch('/bb')
  ]);
};

const [aa, bb] = getFullPost();



// 扩展运算符可以快速扁平化数组
const arr = [11, [22, 33], [44, 55], 66];
const flatArr = [].concat(...arr);







