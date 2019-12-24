# 文件下载

## 目录
<details>
<summary>展开更多</summary>

**基础js**

* [`buffer写入文件`](#buffer写入文件)
* [`几种下载方式`](#几种下载方式)
</details>

## buffer写入文件
> fs.createWriteStream

```js
const xlsx = require('node-xlsx').default;
const fs = require('fs');

const data = [[1, 2, 3], [true, false, null, 'sheetjs'], ['foo', 'bar', new Date('2014-02-19T14:30Z'), '0.3'], ['baz', null, 'qux']];
const buffer = xlsx.build([{name: "mySheetName", data: data}]); // Returns a buffer

const wstream = fs.createWriteStream('aa.xlsx');
wstream.on('open', () => {
  const blockSize = 128;
  const nbBlocks = Math.ceil(buffer.length / (blockSize));
  for (let i = 0; i < nbBlocks; i += 1) {
   const currentBlock = buffer.slice(
    blockSize * i,
    Math.min(blockSize * (i + 1), buffer.length),
   );
   wstream.write(currentBlock);
  }
  wstream.end();
 });
```

---

## 几种下载方式
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
