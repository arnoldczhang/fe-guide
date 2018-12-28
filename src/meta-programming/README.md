# 元编程

## 参考
- https://segmentfault.com/a/1190000016133613

## 目录
<details>
<summary>展开更多</summary>

* [`Symbol`](#Symbol)
* [`Proxy`](#Proxy)

</details>

## Symbol

### Symbol.iterator
使用场景
- for...of
- const [a, b, c] = array
- [...array]

普通用法
```js
var arr = ['a', 'b', 'c'];
for (let val of arr[Symbol.iterator]()) {
  console.log(val);
}
```

迭代器重写
```js
var mix = {
  [Symbol.iterator]: function* () {
    var i = 1;
    while(i < 10) {
      yield i;
      i++;
    }
  }
};
```

### Symbol.toStringTag
```js
function Foo() {}
Foo.prototype[Symbol.toStringTag] = 'aaaa';
var foo = new Foo;
foo.toString(); // [object aaaaa]
```

### Symbol.hasInstance
```js
function Foo(){}
var foo = new Foo;
Foo[Symbol.hasInstance](foo); // true
Foo[Symbol.hasInstance]({}); // false

Object.defineProperty(Foo, Symbol.hasInstance, {
  value: function(inst) {
    return inst.greeting == "hello";
  }
});
```

### Symbol.toPrimitive
运算时调用（==, -, +）
```js
var arr = [1,2,3,4,5];

arr + 10;       // 1,2,3,4,510

arr[Symbol.toPrimitive] = function(hint) {
  if (hint == "default" || hint == "number") {
    // sum all numbers
    return this.reduce( function(acc,curr){
      return acc + curr;
    }, 0 );
  }
};

arr + 10; // 25
```

### Symbol.match
```js
// http://www.ecma-international.org/ecma-262/6.0/#sec-regexp.prototype-@@match
var str = 'aaaa';
var reg = /a/g;
reg[Symbol.match](str);
// ...
```

### Symbol.replace
```js
var str = 'aaaa';
var reg = /a/g;
reg[Symbol.replace](str, 'x');

// 重写@@replace
var protoReplace = RegExp.prototype[Symbol.replace];
RegExp.prototype[Symbol.replace] = function(input, replacer) {
  return protoReplace.bind(this)(input, function(match, index) {
    return (Array.isArray(replacer) ? replacer.shift() : replacer) || '';
  });
};
reg[Symbol.replace](str, [1,2,3]); // 123
```

### Symbol.search
### Symbol.split

### Symbol.isConcatSpreadable
concat时是否会扁平化
```js
var a = [1,2,3],
  b = [4,5,6];

b[Symbol.isConcatSpreadable] = false;
[].concat( a, b );    // [1,2,3,[4,5,6]]
```

## Proxy

### new Proxy(target, handler);
```js
var handler = {
  get(t, key) {
    if (key === 'test') {
      return Reflect.get(t, key);
    } else {
      console.log('aaaa');
    }
  },
};
var target = {};
var proxy = new Proxy(target, handler);
proxy.a; // aaaa
proxy.test // undefined
```

### Proxy.revoke
可撤销代理对象
```js
var obj = { a: 1 };
var handlers = {
  get(target,key,context) {
    console.log( "accessing: ", key );
    return target[key];
  },
};
const { proxy: pobj, revoke: prevoke } = Proxy.revocable( obj, handlers );

pobj.a; // accessing: a
prevoke();
pobj.a; // typeError
```

### Proxy防御未声明属性
```js
var handlers = {
  get() {
    throw "No such property/method!";
  },
  set() {
    throw "No such property/method!";
  }
},
pobj = new Proxy( {}, handlers ),
obj = {
  a: 1,
  foo() {
    console.log( "a:", this.a );
  }
};

// 这里很巧妙，如果key是obj属性，则不会走到原型，也就不会触发proxy
Object.setPrototypeOf( obj, pobj );

obj.a = 3;
obj.foo();      // a: 3

obj.b = 4;      // Error: No such property/method!
obj.bar();      // Error: No such property/method!
```





