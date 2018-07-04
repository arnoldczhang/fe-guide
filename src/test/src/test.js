// process.binding引用built-in模块
const buffer = process.binding('buffer');
const buffer2 = require('buffer');


let a = {x:1, y:2, z:3};

let b = {};
b.x = 1;
b.y = 2;
b.z = 3;

console.log("a is", a);
console.log("b is", b);
console.log("a and b have same map:", %HaveSameMap(a, b));

let c = Object.assign({}, {x:1, y:2, z:3});
let d = Object.assign({}, c);
console.log("c is", c);
console.log("d is", d);
console.log("c and d have same map:", %HaveSameMap(c, d)); // true










