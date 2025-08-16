# typescript

[TOC]

## 参考

- [d.ts文件](https://mp.weixin.qq.com/s/xWcmE7F_4WKBs2FQlDP6jg)
- [vue+ts实践](https://zhuanlan.zhihu.com/p/40322215)
- [TypeScript 2.8下的终极React组件模式](https://juejin.im/post/5b07caf16fb9a07aa83f2977)
- [巧用ts](https://zhuanlan.zhihu.com/p/39620591)
- [ts类型系统](https://mp.weixin.qq.com/s/UwFjEonXUxx6oSKm3jiRag)

## 目录

<details>
<summary>展开更多</summary>

* [`介绍`](#介绍)
* [`基础类型`](#基础类型)
* [`常用语法`](#常用语法)
* [`SOLID`](#SOLID)
* [`编译器`](#编译器)

</details>

---

## 介绍

### interface和type

相同点：

* 允许extends
* 都能描述为函数或对象

不同点：

* interface创建了一种新的类型，而 type 仅仅是别名，是一种引用
* interface通常用于定义对象，type可以定义任意类型
* interface可在子句中重命名，type不行
* interface可多个合并声明union，type不行

---

## 基础类型

- Number
- String
- 元组
- Boolean
- Array
- Enum
- void
- null
- undefined
- never（其他类型的子集，表示从不会出现的值）

### 元组

```ts
// 1. 数组可以定义各元素不同类型
// 2. 初始顺序必须和定义类型一致
// 3. 之后push进去的元素，类型必须包含在定义类型中
let arr: [string, number] = ['a', 123];
```

### never

> 当一个函数一定不会执行`return`，即中途会抛错时，用never，否则别用

```ts
function fn(): never {
  throw new Error('');
}

let a: string;
a = fn(); // 这样可以，never是其他类型子类型
let b: never;
b = a; // 这样不行
```

### enum

> enum 枚举名称{ key1=value1, key2=value2 }
> 
> 1. key不能是数字

```ts
enum HttpCode {
    /** 成功 */
    '200_OK' = 200,
    /** 已生成了新的资源 */
    '201_Created' = 201,
    /** 请求稍后会被处理 */
    '202_Accepted' = 202,
    /** 资源已经不存在 */
    '204_NoContent' = 204,
    /** 被请求的资源有一系列可供选择的回馈信息 */
    '300_MultipleChoices' = 300,
    /** 永久性转移 */
    '301_MovedPermanently' = 301,
    /** 暂时性转移 */
    '302_MoveTemporarily' = 302,
}

// 相比于普通对象map，只能用key访问value，
// enum能同时用key和value，访问到value和key
HttpCode['200_OK']
HttpCode[200]
```

### any

> 1. 可以赋值给任意类型
> 2. 可用unknown替代
> 3. 这是最后选择

### unknown

> 1. 更安全的any
> 2. 仅能赋值给unknown、any
> 3. 没有任何属性、方法

```ts
function format2(value: unknown) {
    value.toFixed(2); // 代码会飘红，阻止你这么做

    // 你需要收窄类型范围，例如：

    // 1、类型断言 —— 不飘红，但执行时可能错误
    (value as Number).toFixed(2);

    // 2、类型守卫 —— 不飘红，且确保正常执行
    if (typeof value === 'number') {
        // 推断出类型: number
        value.toFixed(2);
    }

    // 3、类型断言函数，抛出错误 —— 不飘红，且确保正常执行
    assertIsNumber(value);
    value.toFixed(2);
}
```

---

## 常用语法

### satisfies
> as的上位替代（ts4.9+支持）
>
> as强制确定类型，satisfies支持类型推断后的确定类型

```typescript
type Config = { port: number; domain: string };

const config = {
  port: 3301,
  domain: 'localhost',
  protocol: 'http', // error
} satisfies Config
```

### omit

```ts
interface Props {
  a: string;
  b: string;
  c: string;
}

interface Props1 extends Omit<Props, 'c'> {
  e: string;
}
```

### pick

```ts

```

### in

> 1. 遍历对象key
> 2. 后面的值必须是string、number、symbol

```ts
interface Person {
  name: string;
  age: number;
}

type newP = {
  [key in keyof Person]: number;
}
```

### 让某个接口中的所有属性变为可选

```ts
interface Person {
  name: string;
  age: number;
}

// 方式1
type PartialPerson = { [P in keyof Person]?: Person[P] }
// 方式2
type PartialPerson = Partial<Person>
```

### 让某一种接口的子类型都可以为 null

```ts
type Nullable<T> = {
  [P in keyof T]: T[P] | null;
};
```

### 给TS类型做标记（提示副标题展示）

```ts
/** A cool guy. */
interface Person {
  /** A cool name. */
  name: string,
}
```

### typeof

```ts
const defaultOption = {
  timeout: 500
};

type Opt = typeof defaultOption;
```

### 联合类型

**取其一**

```ts
type Dinner2 = {
  fish: number,
} | {
  bear: number,
}
```

**取并集**

```ts
type Dinner3 = {
  fish: number,
} & {
  bear: number,
}
```

### 类型断言

> 提供一个更加精确的类型范围

**方式一**

```ts
let img = <HTMLImageElement>document.querySelector('.img');
// 当明确断言为HTMLImageElement时，就能操作src属性了
img.src
```

**方式二**

```ts
let img = document.querySelector('.img') as HTMLImageElement;
// 当明确断言为HTMLImageElement时，就能操作src属性了
img.src
```

### 查找类型

```ts
interface Person {
  addr: {
    city: string,
    street: string,
    num: number,
  }
}
```

### keyOf

> 1. 获取类型所有属性名，构成联合类型
> 2. 无法直接对值做操作，或者套一层typeof

```ts
// 示例1
interface Itest{
  webName:string;
  age:number;
  address:string
}

// 'webName' | 'age' | 'address'
type ant = keyof Itest;

// 示例2
function css(el: Element, attr: keyof CSSStyleDeclaration) {
  getComputedStyle(el)[attr];
}

css(document.querySelector('.box'), 'width');
```

**当属性名确认的情况下，也可以用 keyOf 限制属性值**

```ts
interface Props {
  foo: string;
  [key: string]: Props[keyof Props];
}

const props: Props = {
  foo: "bar"
};

props["foo"] = "baz"; // ok
props["bar"] = "baz"; // error，目前看来只能是 string 类型
```

**对值操作的情况**

```ts
const obj = {
  name: 'abc',
  age: 123,
  gender: '男',
};

type key = keyof typeof obj; // 'name' | 'age' | 'gender'
```

### 查找类型+keyOf

```ts
interface API {
  '/user': { name: string },
  '/menu': { foods: Food[] },
}
const get = <URL extends keyof API>(url: URL): Promise<API[URL]> => {
  return fetch(url).then(res => res.json())
};
```

### deepReadOnly+keyOf

```ts
type DeepReadonly<T> = {
  readonly [P in keyof T]: DeepReadonly<T[P]>;
}

const a = { foo: { bar: 22 } };
const b = a as DeepReadonly<typeof a>;

b.foo = 'xxxxxx'; // wrong
```

### namespace

```ts
function test () {}

namespace test {
  export const cache: object = {}
}
```

### 高级类型

> 条件类型

```ts
// T extends U ? X : Y -> 如果 T 包含 U 的所有属性，则返回 X，否则返回 Y
function process<T extends string | null>(
 text: T
): T extends string ? string : null {
 ...
}

process("foo").toUpperCase() // ok
process<string>("foo").toUpperCase() // ok
process().toUpperCase() // error
```

### Record

> 类似enum

```ts
type AnimalType = 'cat' | 'dog' | 'frog';
interface AnimalDescription { name: string, icon: string }
const AnimalMap: Record<AnimalType, AnimalDescription> = {
  cat: { name: '猫', icon: '🐱'},
  dog: { name: '狗', icon: '🐶' },
  forg: { name: '蛙', icon: '🐸' }, // Hey!
};
```

### 标准注释

```ts
/**
 * 一个方法：生成错误提示信息
 * 
 * @param {string} message 提示信息，比如`you have a error`
 * @param {number | string} code 错误码，数字和字符都行
 * @param {string} type 类型，请写`demo1`或者`demo2`
 * 
 * [还不懂？点这里吧](https://www.google.com)
 * 
 * ```js
 * // demo
 * genErrMsg('demo', 10086)
 * 
 * ```
 */
export function genErrMsg (message: string, code: number | string, type?: ('demo1' | 'demo2')): string {
    return (message || `网络繁忙，请稍候再试`) + (code ? `(${code})` : ``)
}
```

### 其他骚操作

```ts
type StringOrNumber = string | number;  
type Text = string | { text: string };  
type NameLookup = Dictionary<string, Person>;  
type Callback<T> = (data: T) => void;  
type Pair<T> = [T, T];  
type Coordinates = Pair<number>;  
type Tree<T> = T | { left: Tree<T>, right: Tree<T> };
```

### is推断

```ts
function isAdmin(user: Person): user is Admin {
  return user.hasOwnProperty('role')
}


if (isAdmin(user)) {
  // ...
}
```

### 函数重载

```ts
// 根据第二个入参，决定返回值的类型
function filterPersons(
  persons: Person[],
  personType: string,
  criteria: Partial<Person>,
) {}

// 分别定义admin
function filterPersons(
  persons: Person[],
  personType: "admin",
  criteria: Partial<Person>,
): Admin[]

// 分别定义user
function filterPersons(
  persons: Person[],
  personType: "user",
  criteria: Partial<Person>,
): User[]

let usersOfAge23: User[] = filterPersons(persons, "user", { age: 23 })
let adminsOfAge23: Admin[] = filterPersons(persons, "admin", { age: 23 })
```

### 精确定义数组内元素类型

```ts
// 如果这样定义，返回值类型会变成(K | T)[]，这是ts默认的悲观行为
function swap<T, K>(v1: T, v2: K) {
  return [v2, v1];
}

// 加上了 as const 就好了
function swap<T, K>(v1: T, v2: K) {
  return [v2, v1] as const;
}

swap<string,number>('a', 1);
```

### 类型保护

> 几个关键词可以做类型保护：typeof、instanceof、自定义

```ts
function fn(str: string|string[]) {
  // 方式1：typeof
  if (typeof str === 'string') {
    return str.substring(1,2);
  } else {
    str.push();
  }

  // 方式2：instanceof
  if (str instanceof String) {
    return str.substring(1,2);
  } else {
    str.push();
  }
}
```

```ts
// 方式3：自定义
// is关键词可以让typescript识别为类型保护
function canForEach(data: string|string[]): data is string[] {
  return (<string[]>data).forEach !== undefined;
}

function fn(str: string|string[]) {
  if (canForEach(str)) {
    str.forEach
  }
}
```

---

## SOLID

### S: Single Responsibilty Principle

```js
abstract class Employee {
  // This needs to be implemented
  abstract calculatePay (): number;
  // This needs to be implemented
  abstract reportHours (): number;
  // let's assume THIS is going to be the 
  // same algorithm for each employee- it can
  // be shared here.
  protected save (): Promise<any> {
    // common save algorithm
  }
}

class HR extends Employee {
  calculatePay (): number {
    // implement own algorithm
  }
  reportHours (): number {
    // implement own algorithm
  }
}
```

### O: Open-Closed Principle

开闭原则只定义了对修改关闭，对扩展开放

```js
/**
 * 1. 定义基础service
 **/
class IMailService {
  constructor() {
    /*
    */
  }
}

/**
 * 2. 对基础service做扩展
 **/
class SendGridEmailService implements IMailService {
  sendMail(email: IMail): Promise<IEmailTransmissionResult> {
    // algorithm
  }
}

class MailChimpEmailService implements IMailService {
  sendMail(email: IMail): Promise<IEmailTransmissionResult> {
    // algorithm
  }
}

class MailGunEmailService implements IMailService {
  sendMail(email: IMail): Promise<IEmailTransmissionResult> {
    // algorithm
  }
}

/**
 * 3. controller只调用传入的service方法
 **/
class CreateUserController extends BaseController {
  private emailService: IEmailService;
  constructor (emailService: IEmailService) {
    this.emailService = emailService;
  }

  protected executeImpl (): void {
    const mail = new Mail(...)
    this.emailService.sendMail(mail);
  }
}
```

### L: Liskov-Substitution Principle

### I: Interface Segregation Principle

依赖倒置原则告诉我们要面向接口编程

```js
interface IMailService {
  // refering to concrete "PrettyEmail" and "ShortEmailTransmissionResult" from an abstraction
  sendMail(email: PrettyEmail): Promise<ShortEmailTransmissionResult>
}

class SendGridEmailService implements IMailService {
  // concrete class relies on abstractions
  sendMail(email: IMail): Promise<IEmailTransmissionResult> {
  }
}

// 将service定义为interface的service（供扩展）
class CreateUserController extends BaseController {
  private emailService: IEmailService; // <- abstraction
  constructor (emailService: IEmailService) { // <- abstraction
    this.emailService = emailService;
  }

  protected executeImpl (): void {
    // handle request

    // send mail
    const mail = new Mail(...)
    this.emailService.sendMail(mail);
  }
}
```

### D: Dependency Inversion Principle

---

## 编译器

[参考](https://mp.weixin.qq.com/s/nLG43aDSomGjCS5iIT8Gmg)

```js
import * as ts from "TypeScript";

const program = ts.createProgram(fileNames, options); // 创建一个 program 应用

const { emitSkipped, diagnostics } = program.emit();
```

### 增量编译

incremental

[ts3.4-增量编译](https://mp.weixin.qq.com/s/830njEJhNGSSvYO7zHXg8A)
