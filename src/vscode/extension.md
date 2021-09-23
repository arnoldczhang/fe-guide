ESLint
GitLengs
Image preview
Prettier
Stock Watch
TabNine
TSLint
Vetur



## 技巧

### 排除.gitignore的搜索范围

搜索默认会以 .gitignore 为准，但有时候就想搜这些文件夹的内容（比如node_modules），可以这样处理：

```json
{
      "search.exclude": {
        "**/node_modules": false
    },
}
```

### debug visualizer

> 1. 可视化调试
> 2. 支持各种chart

[参考](https://addyosmani.com/blog/visualize-data-structures-vscode/)

