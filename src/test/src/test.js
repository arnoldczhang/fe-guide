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













