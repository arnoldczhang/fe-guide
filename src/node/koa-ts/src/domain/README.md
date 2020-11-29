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
import AbstractTable from './AbstractTable';

const tableName = 'm_h5pageloadx_1m';

export default class MH5pageloadx1m extends AbstractTable {
  private appVersion: string = 'appVersion';

  private categoryId: string = 'categoryId';

  private appType: string = 'appType';

  private pagePath: string = 'pagePath';

  constructor() {
    super(tableName);
  }

  public getAppVersion(): ICalcCollection {
    return this.get(this.appVersion);
  }

  public getCategoryId(): ICalcCollection {
    return this.get(this.categoryId);
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
import MH5networkx1m from '../../domain/aggregate/MH5networkx1m';

export default class Service {
  public async getxxxxx({
    where,
  }: {
    where: ICO;
  }): Promise<any> {
    const {
      beginDate,
      endDate,
      reqUrl,
    } = where;
    const table = new MH5networkx1m();
    const sql = table.select(
      table.getAppVersion(),
    ).where(
      appendCommonParams({ beginDate, endDate }, table.getName()),
      table.getReqUrl().eq(reqUrl),
      table.getAppName().eq(1),
    ).end();
    return sql;
  }
}
```

### 领域事件
> 目前还未使用，希望能做到聚合根的变动，通知到外部监听
