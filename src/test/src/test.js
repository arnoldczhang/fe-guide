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


// const babel = require("babel-core");
// const code = `
//   var obj = {
//     breadthTraversal() {
//       if (!this.root) return null
//       let q = new Queue()
//       // 将根节点入队
//       q.enQueue(this.root)
//       // 循环判断队列是否为空，为空
//       // 代表树遍历完毕
//       while (!q.isEmpty()) {
//         // 将队首出队，判断是否有左右子树
//         // 有的话，就先左后右入队
//         let n = q.deQueue()
//         console.log(n.value)
//         if (n.left) q.enQueue(n.left)
//         if (n.right) q.enQueue(n.right)
//       }
//     }
//   }
// `;
// console.log(babel.transform(code).code);


// const http = require('http');

// http.createServer(function(req, res){//回调函数
//   console.log(req.httpVersion);
//   console.log(req.headers);
//   console.log(req.method);
//   console.log(req.url);
//   console.log(req.trailers);
//   console.log(req.complete);
//   res.writeHead(200,{'Content-Type':'text/javascript'});
//   res.end(``);
// }).listen(8000);

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


function exampleFunction() {
    return 3;
    eval('');
}

function printStatus(fn) {
    switch(%GetOptimizationStatus(fn)) {
        case 1: console.log("Function is optimized"); break;
        case 2: console.log("Function is not optimized"); break;
        case 3: console.log("Function is always optimized"); break;
        case 4: console.log("Function is never optimized"); break;
        case 6: console.log("Function is maybe deoptimized"); break;
        case 7: console.log("Function is optimized by TurboFan"); break;
        default: console.log("Unknown optimization status"); break;
    }
}

//Fill type-info
exampleFunction();
// 2 calls are needed to go from uninitialized -> pre-monomorphic -> monomorphic
exampleFunction();

%OptimizeFunctionOnNextCall(exampleFunction);
//The next call
exampleFunction();

//Check
printStatus(exampleFunction);




