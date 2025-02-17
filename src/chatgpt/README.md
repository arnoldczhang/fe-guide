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
- [本地运行大模型工具](https://mp.weixin.qq.com/s/Tc9BkRGVu_9AiwH0PLlFgQ)
- [DeepSeek-国产最屌开源大模型](https://github.com/deepseek-ai/DeepSeek-V3?tab=readme-ov-file)
- [通过Rag实现与大模型对话检索](https://mp.weixin.qq.com/s/6yhYLKfNrumSMs7ELvktjg)
- [ai声音克隆](https://anyvoice.net/zh/ai-voice-cloning)
- [2025deepseek提示词](https://www.cnblogs.com/vipstone/p/18710104)

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

### CO-STAR形式的prompt

```
## Context
提供与任务相关的背景信息，帮助LLM理解讨论的具体场景，确保其响应具有相关性

## Objective
明确你希望LLM执行的具体任务。清晰的目标有助于模型聚焦于完成特定的请求，从而提高输出的准确性

## Style
指定希望LLM采用的写作风格。这可以是某位名人的风格或特定职业专家的表达方式，甚至要求LLM不返回任何语气相关文字，确保输出符合要求

## Tone
设定返回的情感或态度，例如正式、幽默或友善。这一部分确保模型输出在情感上与用户期望相符

## Audience
确定响应的目标受众。根据受众的不同背景和知识水平调整LLM的输出，使其更加适合特定人群

## Response
规定输出格式，以确保LLM生成符合后续使用需求的数据格式，如列表、JSON或专业报告等。这有助于在实际应用中更好地处理LLM的输出

```

举例：
```
## Context
我是一名正在寻找酒店信息的旅行者，计划在即将到来的假期前往某个城市。我希望了解关于酒店的设施、价格和预订流程等信息。

## Objective
请提供我所需的酒店信息，包括房间类型、价格范围、可用设施以及如何进行预订。

## Style
请以简洁明了的方式回答，确保信息易于理解。

## Tone
使用友好和热情的语气，给人一种欢迎的感觉。

## Audience
目标受众是普通旅行者，他们可能对酒店行业不太熟悉。

## Response
请以列表形式呈现每个酒店的信息，包括名称、地址、房间类型、价格和联系方式。每个酒店的信息应简短且直接，便于快速浏览。

```

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

## 文档聊天机器人
[langchain-doc chatbot](https://js.langchain.com/docs/tutorials/rag/)

