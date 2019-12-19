# 文件下载

## 几种方式
- 后端输出源文件内容，前端读取+模拟下载
- 后端输出源文件内容+类型格式，前端弹框下载
- 后端输出buffer，前端读取+模拟下载

> 以 koa 为例

### 后端输出源文件内容，前端读取+模拟下载

```js
// node
const res = fs.readFileSync('test.json', 'utf-8');
return this.body = res;
```

```js
// 前端
const file = new Blob([res], { type: 'json' });
const url = URL.createObjectURL(file);
const link = document.createElement('a');
link.href = url;
link.download = 'aaa.json';
const evt = new MouseEvent('click');
link.dispatchEvent(evt);
URL.revokeObjectURL(url);
```

### 后端输出源文件内容+类型格式，前端弹框下载
```js
// node
this.ctx.set('Content-Type', 'application/json');
this.ctx.set('Content-Disposition', 'attachment;filename=test.json');
const res = fs.readFileSync('test.json', 'utf-8');
return this.createSuccessResponse(res);
```

```js
// 前端
window.open(`${PATH}/test.json`);
```

### 后端输出buffer，前端读取+模拟下载
```js
// node
const res = await new Promise((resolve) => {
  let out = '';
  const fReadStream = fs.createReadStream('test.json');
  fReadStream.on('data', (chunk) => {
    out += chunk;
  });
  fReadStream.on('end', () => {
    resolve(out);
  });
});
return this.createSuccessResponse(Buffer.from(res, 'utf-8'));
```

```js
// 前端
const reader = new FileReader();

reader.onload = (event) => {
  const data = event.target.result;
  const file = new Blob([data], { type: 'json' });
  const url = URL.createObjectURL(file);
  const link = document.createElement('a');
  link.href = url;
  link.download = 'aaa.json';
  const evt = new MouseEvent('click');
  link.dispatchEvent(evt);
  URL.revokeObjectURL(url);
};

reader.readAsText(new Blob(
  [new Uint16Array(res)],
  { type: 'application/octet-binary' },
));
```
