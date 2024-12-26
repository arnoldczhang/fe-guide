# chatgpt

[TOC]

## 参考

- [根据代码生成代码文档，集成CICD](https://github.com/context-labs/autodoc)
- [gpt生成图表](https://github.com/ObservedObserver/viz-gpt)
- [AI合集](https://ai.nancheng.fun/)
- [gpt合集-1](https://start.chatgot.io/)
- [现有的一些AIGC](https://mp.weixin.qq.com/s?__biz=MzkxNDIzNTg4MA==&mid=2247488559&idx=1&sn=294b604f54aac0e8f925cee2a638bdec&scene=21#wechat_redirect)
- [字节跳动-豆包](https://www.doubao.com/chat)
- [prompt指南](https://mp.weixin.qq.com/s/jOU2qT5o88tuZC1p6vLkJw)
- [前端训练gpt](https://mp.weixin.qq.com/s/0lSPqDmECyKcemXkWrgUuA)
- [聊天生成网页](https://bolt.new/)
- [本地自建ai知识库](https://mp.weixin.qq.com/s/KlEocqoukwNU4DZYEzph8Q)

## Prompt

> 用于引导机器学习模型生成符合预期输出的文本或代码片段

**Prompt = context + step + shot + question**

### context

> 限定语境

```
作为一个xxx专家，需要怎么怎么做：
```

### step

> 教AI按什么步骤、从什么角度、基于某些限定条件思考

```
- step1
- step2
- step3
```

### shot

**zero-shot**

无样本提示，这样会导致：

- 输出结果不稳定（内容、格式等）
- 不利于二次处理

**few-shot**

给出回答结果的样例，比如：

```
例子：
title
xxx: ...
yyy: ...
```

### question

到这里才开始你真正的提问-_-

## 境界

> 程序 = 算法 + 结构
> 
> 软件 = 程序 + 软件工程
> 
> 软件企业= 软件 + 商业模式

chatgpt在第一层大力提效，人类应该在二、三层发力。

## 传输

```js
var result;
fetch(`/receive?channel=${channel}`, {
  method: 'POST',
  headers: {
    'content-type': 'application/json',
    accept: 'text/event-stream',
  },
}).then(async res => {
  const reader = res.body?.pipeThrough(new TextDecoderStream())?.getReader();
  while (reader && true) {
    const { done, value } = await reader.read();
    if (done) return;
    result = value;
  }
});
```