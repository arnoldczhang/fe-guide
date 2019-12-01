// process.binding引用built-in模块
// const buffer = process.binding('buffer');
// const buffer2 = require('buffer');


// let a = {x:1, y:2, z:3};

// let b = {};
// b.x = 1;
// b.y = 2;
// b.z = 3;

// console.log("a is", a);
// console.log("b is", b);
// console.log("a and b have same map:", %HaveSameMap(a, b));

// let c = Object.assign({}, {x:1, y:2, z:3});
// let d = Object.assign({}, c);
// console.log("c is", c);
// console.log("d is", d);
// console.log("c and d have same map:", %HaveSameMap(c, d)); // true


// console.log(process.cwd());


// const { matches } = require('z');

// const result = matches(1)(
//   (x = 2)      => console.log('number 2 is the best!!!'),
//   (x = Date)   => console.log('blaa.. dates are awful!'),
//   (x = Number) => console.log(`number ${x} is not that good`),
// );


// const babel = require("@babel/core");
// const code = `
//   async function aa () {
//     await new Promise((resolve) => {
//       setTimeout(() => {
//         resolve(10);
//       }, 1000);
//     });
//   };

//   aa();
// `;
// console.log(babel.transformSync(code, {
//   presets: [
//     ['@babel/env', {
//       "modules": false
//     }],
//   ],
//   plugins:[
//     ['@babel/plugin-transform-runtime', {
//       regenerator: true,
//     }],
//   ]
// }).code);

const http = require('http');
const fs = require('fs');
const path = require('path');
const request = require('request');
const querystring = require('querystring');



// http.createServer(function(req, res){//回调函数
//   var body = "";
//   req.on('data', function (chunk) {
//       body += chunk;
//   });
//   req.on('end', function () {
//     body = querystring.parse(body);
//     res.writeHead(200,{'Content-Type':'text/html'});
//     res.write(fs.readFileSync(path.resolve(__dirname, './test.html'), 'utf-8'));
//     res.end();
//   });
// }).listen(8880);



// var node = {
//   name: "0",
//   child: [
//     {
//       name: "a",
//       child: [
//         { name: "a1" },
//         { name: "a2", child: [{ name: "a21" }, { name: "a22" }] }
//       ]
//     },
//     { name: "b", child: [{ name: "b1" }, { name: "b2" }] }
//   ]
// };

// function deep(input, arr = []) {
//   let index = 0;
//   let next = input[index];
//   while (next) {
//     arr.push(next.name);
//     if (next.child) {
//       deep(next.child, arr);
//     }
//     next = input[++index];
//   }
//   return arr;
// };

// function deep(node, arr = []) {
//   const temp = [node];
//   let next = temp.shift();
//   while (next) {
//     arr.push(next.name);
//     if (next.child) {
//       temp.unshift(...next.child);
//     }
//     next = temp.shift();
//   }
//   return arr;
// };

// console.log(deep(node));

// // 城市名-经纬
// const cities = require('./city2jw');
// // 城市名-citycode
// let cc = require('./citycode');

// cc = Object.keys(cc).reduce((res, name) => {
//   const re = /市$/;
//   let oldVal;
//   if (re.test(name)) {
//     oldVal = cc[name];
//     name = name.replace(re, '');
//   }
//   res[name] = oldVal || cc[name];
//   return res;
// }, {});

// const newCCKey = Object.keys(cc);

// const result = Object.keys(cities).reduce((res, name) => {
//   const oldName = name;
//   let code = cc[name];
//   if (code) {
//     res[code] = [oldName, ...cities[oldName]];
//   } else {
//     if (/地区$/.test(name)) {
//       name = name.replace(/地区$/, '');
//       code = cc[name];
//       if (code) {
//         try {
//           res[code] = [oldName, ...cities[oldName]];
//         } catch(err) {
//           debugger;
//         }
//       }
//     } else {
//       if (/州$/.test(name)) {
//         name = name.replace(/州$/, '');
//       }
//       const nameRe = new RegExp(`${name}.+$`);
//       if (!newCCKey.some((key) => {
//         if (nameRe.test(key)) {
//           res[cc[key]] = [oldName, ...cities[oldName]];
//           return true;
//         }
//         return false;
//       })) {
//         console.log(3, name);
//       }
//     }
//   }
//   return res;
// }, {});

// fs.writeFileSync(path.resolve(__dirname, './code2jw.js'), `
//   export default ${JSON.stringify(result)}

// `)


// const cityObj = require('./code2jw');
// const cityCodeList = require('./city-code');

// const citycode2jw = Object.keys(cityObj).reduce((res, adcode) => {
//   const city = cityObj[adcode];
//   const [cityName] = city;
//   if (!cityCodeList.some(({
//     name,
//     citycode,
//   }) => {
//     if (name.indexOf(cityName) > -1 && !/区$/.test(name)) {
//       res[citycode] = city;
//       if (citycode < 1000) {
//         res[`0${citycode}`] = city;
//       }
//       return true;
//     }
//     return false;
//   })) {
//     console.log(cityName);
//   };
//   return res;
// }, {});


// fs.writeFileSync(path.resolve(__dirname, './citycode2jw.js'), `
//   export default ${JSON.stringify(citycode2jw)}

// `)





// demo1
// let input = {};
// let validator = {
//   set(target, key, value) {

//   },
//   get(target, key, receiver) {
//     let copyKey = key;
//     const lambda = [];
//     const reMap = {
//       baseTrans: /^base(\d+)To(\d+)/i,
//     };

//     const reFunc = {
//       baseTrans(
//         methodName = '',
//         parseNum = 10,
//         toStringNum = 10,
//         baseInput = 0,
//       ) {
//         if (toStringNum > 36 || parseNum > 36 || toStringNum < 2 || parseNum < 2) {
//           throw new Error(`TypeError: baseTrans '${methodName}' is not a function`);
//         }
//         return parseInt(baseInput, parseNum || 10).toString(toStringNum || 10);
//       },
//     };

//     while (copyKey.length) {
//       const reKeyArray = Object.keys(reMap);
//       for (let i = 0; i < reKeyArray.length; i += 1) {
//         const reKey = reKeyArray[i];
//         const re = reMap[reKey];
//         const result = copyKey.match(re);
//         if (result) {
//           lambda.push(reFunc[reKey].bind(this, ...result));
//           copyKey = copyKey.slice(result[0].length);
//           break;
//         }
//       }
//       copyKey = '';
//     }
//     return val => lambda.reduce((result, func) => func(result), val);
//   },
// };

// // demo2
// input = function sum(...args) {
//   return args.reduce((a, b) => a + b, 0);
// };
// validator = {
//   apply(target, thisArg, args) {
//     console.log(target, thisArg, args);
//   },
// };

// window.proxy = new Proxy(input, validator);

// const recast = require('recast');

// const code =
//   `
//   function add(a, b) {
//     return a +
//       // 有什么奇怪的东西混进来了
//       b;
//   }
//   `;
// const ast = recast.parse(code);

// console.log(ast)


// const async_hooks = require('async_hooks');

// async_hooks.createHook({
//   init(asyncId) {
//     print({ type: 'init', msg: asyncId });
//   },
// }).enable();


// function exampleFunction() {
//     return 3;
//     eval('');
// }

// function printStatus(fn) {
//     switch(%GetOptimizationStatus(fn)) {
//         case 1: console.log("Function is optimized"); break;
//         case 2: console.log("Function is not optimized"); break;
//         case 3: console.log("Function is always optimized"); break;
//         case 4: console.log("Function is never optimized"); break;
//         case 6: console.log("Function is maybe deoptimized"); break;
//         case 7: console.log("Function is optimized by TurboFan"); break;
//         default: console.log("Unknown optimization status"); break;
//     }
// }

// //Fill type-info
// exampleFunction();
// // 2 calls are needed to go from uninitialized -> pre-monomorphic -> monomorphic
// exampleFunction();

// %OptimizeFunctionOnNextCall(exampleFunction);
// //The next call
// exampleFunction();

// //Check
// printStatus(exampleFunction);

// const CryptoJS = require('crypto-js');
// const msg = CryptoJS.SHA256("Message Part 1");
// console.log(msg);


// const { SyncHook } = require('tapable');
// debugger;
// const FrontEnd = new SyncHook();
// FrontEnd.tap('webpack',()=>{
//   console.log("get webpack")
// });
// FrontEnd.tap('react',()=>{
//   console.log("get react")
// });
// FrontEnd.learn=()=>{
//   FrontEnd.call()
// };
// FrontEnd.learn();


// const glob = require('glob');
// const { resolve } = require('path');

// console.log(glob.sync(resolve(__dirname, '../../webpack/*.js')));



// const { SyncBailHook } =require('tapable');
// const FrontEnd = new SyncBailHook(['name']);
// FrontEnd.tap('webpack',(name)=>{
//   console.log(name+" get webpack ")
//   return false;
// });
// FrontEnd.tap('react',(name)=>{
//   console.log(name+" get react")
// });
// FrontEnd.start=(...args)=>{
//   FrontEnd.call(...args)
// };
// FrontEnd.start('xiaoming');



// const list = Array.from({ length: 16 }, (v, index) => ++index)
// const key = Buffer.from(list)
// console.log(key.toString('base64'))


// const { graphql, buildSchema } = require('graphql');

// const schema = buildSchema(`
//   type Query {
//     hello: String
//   }
// `);

// const root = { hello: () => 'Hello world!' };

// graphql(schema, '{ hello }', root).then((response) => {
//   console.log(response);
// });

// const request = require('superagent');

// request
//   .get('localhost:2048/graphql?query={hello}')
//   .end((err, resp) => {
//     if (err) {
//       reject(err);
//     }

//     if (resp.ok) {
//       console.log(resp.text);
//     }
//   });

// console.log(Buffer.from('1').toString("hex"));
// console.log(Buffer.from('b').toString("hex"));
// console.log(require("crypto").createHash('sha256').update(('aaa')).digest('hex'));


// var JavaScriptObfuscator = require('javascript-obfuscator');

// var obfuscationResult = JavaScriptObfuscator.obfuscate(
//   `
//         (function(){
//             var variable1 = '5' - 3;
//             var variable2 = '5' + 3;
//             var variable3 = '5' + - '2';
//             var variable4 = ['10','10','10','10','10'].map(parseInt);
//             var variable5 = 'foo ' + 1 + 1;
//             console.log(variable1);
//             console.log(variable2);
//             console.log(variable3);
//             console.log(variable4);
//             console.log(variable5);
//         })();
//     `, {
//     compact: false,
//     controlFlowFlattening: true
//   }
// );

// console.log(obfuscationResult.getObfuscatedCode());
