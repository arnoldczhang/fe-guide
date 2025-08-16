# api

## jiraAPI
[api](https://docs.atlassian.com/software/jira/docs/api/REST/7.6.1/#api)

### 校验方式
```js
headers: {
  // 授权信息btoa转换下
  Authorization: 'Basic base64(username:password)',
  Accept: 'application/json',
},
```

### 例子
```js
import fetch from 'node-fetch';

// 查询接口
const uri = 'https://jira.xxx.cn/rest/api/2/search';
const response = fetch(`${uri}?${stringify({
    startIndex: 0,
    filterId: -1,
    // 这里筛选出属于 xxx 的，在 ooo 项目的未解决问题
    jql: 'assignee = xxx AND project = ooo AND resolution = Unresolved order by updated DESC',
  })}`, {
    method: 'GET',
    headers: {
      // 授权信息btoa转换下
      Authorization: 'Basic base64(username:password)',
      Accept: 'application/json',
    },
  } as any);

  const resData = await response;
  const data = await resData.json();
```

---

## 货币汇率api
[api](https://currencyscoop.com/)
