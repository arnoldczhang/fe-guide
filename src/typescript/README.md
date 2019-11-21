# typescript

## 参考
- [d.ts文件](https://mp.weixin.qq.com/s/xWcmE7F_4WKBs2FQlDP6jg)
- [vue+ts实践](https://zhuanlan.zhihu.com/p/40322215)
- [TypeScript 2.8下的终极React组件模式](https://juejin.im/post/5b07caf16fb9a07aa83f2977)
- [巧用ts](https://zhuanlan.zhihu.com/p/39620591)


## 目录
<details>
<summary>展开更多</summary>

* [`介绍`](#介绍)
* [`常用语法`](#常用语法)
* [`SOLID`](#SOLID)

</details>

## 介绍

### interface和type
* interface创建了一种新的类型，而 type 仅仅是别名，是一种引用
* interface通常用于定义对象，type可以定义任意类型
* interface可在子句中重命名，type不行
* interface可多个合并声明union，type不行

---

## 常用语法

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

### 默认值生成type
```ts
const defaultOption = {
  timeout: 500
};

type Opt = typeof defaultOption;
```

### 联合类型（取其一）
```ts
type Dinner2 = {
  fish: number,
} | {
  bear: number,
}
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
> 获取对象所有属性名，构成联合类型

```ts
interface Itest{
  webName:string;
  age:number;
  address:string
}

// 'webName' | 'age' | 'address'
type ant=keyof Itest;
```

> 当属性名确认的情况下，也可以用 keyOf 限制属性值

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

### Record
类似enum
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

### enum
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