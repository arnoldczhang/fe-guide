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
- [deepseek本地部署指南](https://mp.weixin.qq.com/s/SPEvYTmTBxhoEkJqm1yPmw)
- [提示词优化器](https://github.com/linshenkx/prompt-optimizer)

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

### prompt模板
- 给到模型的数据，如果是json格式，建议转成md格式，省token
- [prompt优化器](https://github.com/linshenkx/prompt-optimizer)

```
# Role: XX Data Query Formatter

## Profile
- language: Chinese
- description: 专注于XXX的AI助手，能够将用户的自然语言查询解析并转换为JSON格式以便后续处理。
- background: 具备XXX的专业知识，熟悉XXX的数据模型。
- personality: 严谨、细致、高效。
- expertise: 数据查询解析、JSON格式化、商业智能系统。
- target_audience: 商业智能系统用户、数据分析师、数据工程师。

## Skills

1. 数据解析与格式化
   - 自然语言解析: 能够理解用户关于业务数据的自然语言查询。
   - JSON格式化: 将解析后的查询转换为符合特定JSON Schema的格式。
   - 数据模型匹配: 根据提供的模型元数据，匹配用户查询中的字段和条件。

2. 商业智能系统操作
   - xxx
   - xxx
   - xxx

## Rules

1. 基本原则：
   - xxx

2. 行为准则：
   - 用户需求优先: 确保输出的JSON格式完全满足用户的需求。
   - 数据准确性: 确保解析和格式化后的数据准确无误。
   - 高效执行: 快速响应用户查询，确保高效完成任务。

3. 限制条件：
   - xxx

## Workflows

- 目标: 将用户的自然语言查询解析并转换为符合JSON Schema的格式。
- 步骤 1: xxx
- 步骤 2: xxx
- 步骤 3: xxx
- 步骤 4: xxx
- 预期结果: xxx

## Initialization
作为XX Data Query Formatter，你必须遵守上述Rules，按照Workflows执行任务。

## 输出要求:
严格遵循下方JSON Schema:
\`\`\`json
这里是json
\`\`\`

## 预期输出示例:
\`\`\`json
这里是json
\`\`\`

## 输入要素:
1. xxx
2. xxx

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

## deepseek
- [api](https://api-docs.deepseek.com/zh-cn/api/create-chat-completion)

## MCP
- [mcp - 进阶版function call](https://mp.weixin.qq.com/s/jV46NMDfcJRiklUG_RLsmQ)
- [figma支持mcp导出视觉稿](https://mp.weixin.qq.com/s/i4VGAv8mg3wBVgQrKqUmWQ)


### 本地调试
cline

配置：
```json
{
  "mcpServers": {
    "log": {
      "timeout": 60,
      "command": "node",
      "args": [
        "/mnt/d/website/vue/vite-project/test.js"
      ],
      "transportType": "stdio"
    }
  }
}
```

样例文件内容：
```js
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";

const server = new McpServer({
  name: "TimeServer", // 服务器名称
  version: "1.0.0", // 服务器版本
});


server.tool(
  "getCurrentTime", // 工具名称,
  "根据时区（可选）获取当前时间", // 工具描述
  {
    timezone: z
      .string()
      .optional()
      .describe(
        "时区，例如 'Asia/Shanghai', 'America/New_York' 等（如不提供，则使用系统默认时区）"
      ),
  },
  async ({ timezone }) => {
    // 具体工具实现，这里省略
    return timezone;
  }
);

/**
 * 启动服务器，连接到标准输入/输出传输
 */
async function startServer() {
  try {
    console.log("正在启动 MCP 时间服务器...");
    // 创建标准输入/输出传输
    const transport = new StdioServerTransport();
    // 连接服务器到传输
    await server.connect(transport);
    console.log("MCP 时间服务器已启动，等待请求...");
  } catch (error) {
    console.error("启动服务器时出错:", error);
    process.exit(1);
  }
}

startServer();
```

### MCP市场
- https://github.com/modelcontextprotocol/servers
- https://mcpmarket.cn/
- https://mcp.so/
