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

### 查找类型 + keyOf
```ts
interface API {
  '/user': { name: string },
  '/menu': { foods: Food[] },
}
const get = <URL extends keyof API>(url: URL): Promise<API[URL]> => {
  return fetch(url).then(res => res.json())
}
```

### deepReadOnly


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