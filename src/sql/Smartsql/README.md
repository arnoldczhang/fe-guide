# 基于ddd的sql查询

## 概念

**领域**

- 聚合根
- 领域事件
- 领域服务

## 领域

### 聚合根
> 希望将每个 table 对象都分别作为一个单独聚合根，字段即其属性，仅暴露 get 方法用于获取属性

```ts
// domain/aggregate/AbstractTable.ts
// 这里应抽象出所有 table 的共性（字段、行为）
// 更深入的话，限流、熔断、降级等保护措施也应在这里完成
```

```ts
// domain/aggregate/ExampleTable.ts
import AbstractTable from './AbstractTable';

const tableName = 'ExampleTable';

export default class ExampleTable extends AbstractTable {
  private appVersion: string = 'appVersion';

  private appType: string = 'appType';

  private pagePath: string = 'pagePath';

  constructor() {
    super(tableName);
  }

  public getAppVersion(): ICalcCollection {
    return this.get(this.appVersion);
  }

  public getAppType(): ICalcCollection {
    return this.get(this.appType);
  }

  public getPagePath(): ICalcCollection {
    return this.get(this.pagePath);
  }
}
```

### 领域服务
> 领域服务用于生成对应聚合根的sql语句，但不做具体数据库操作（具体操作还是在原来的service里）

```ts
// service/testService.ts
import ExampleTable from '../../domain/aggregate/ExampleTable';

export default class Service {
  public async getxxxxx({
    where,
  }: {
    where: ICO;
  }): Promise<any> {
    const {
      pagePath,
    } = where;
    const table = new ExampleTable();
    const sql = table.select(
      table.getAppVersion(),
    ).where(
      table.getAppName().eq('aaaa'),
      table.getPagePath().eq(pagePath).rename('targetPagePath'),
    ).end();
    return sql;
  }
}
```

### 领域事件
> 领域事件是对过去发生事务的陈述，所以领域服务的调用，应触发对应的监听事件，
>
> 比如外部监听了 ordersubmitted 事件，当领域服务 submitOrder 被执行后，ordersubmitted 队列中的监听应该被依次触发
