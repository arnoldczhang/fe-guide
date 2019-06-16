## 参考
- [d.ts文件](https://mp.weixin.qq.com/s/xWcmE7F_4WKBs2FQlDP6jg)
- [vue+ts实践](https://zhuanlan.zhihu.com/p/40322215)
- [TypeScript 2.8下的终极React组件模式](https://juejin.im/post/5b07caf16fb9a07aa83f2977)

## 介绍

### interface和type
* interface创建了一种新的类型，而 type 仅仅是别名，是一种引用
* interface通常用于定义对象，type可以定义任意类型
* interface可在子句中重命名，type不行
* interface可多个合并声明union，type不行

---

## 常用语法

**让某个接口中的所有属性变为可选**

```typescript
interface Person {
    name: string;
    age: number;
}

// 方式1
type PartialPerson = { [P in keyof Person]?: Person[P] }
// 方式2
type PartialPerson = Partial<Person>
```

**让某一种接口的子类型都可以为 null**

```typescript
type Nullable<T> = {
  [P in keyof T]: T[P] | null;
};
```

---

## SOLID





