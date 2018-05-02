# git flow

## 参考

1. https://juejin.im/post/5ad99c05f265da0b9265231b
2. ![git-flow](git-flow.png)

## 总结
- 主要分支
  - master: 永远处在即将发布(production-ready)状态
  - develop: 最新的开发状态
- 辅助分支
  - feature: 开发新功能的分支, 基于 develop, 完成后 merge 回 develop
  - release: 准备要发布版本的分支, 用来修复 bug. 基于 develop, 完成后 merge 回 develop 和 master
  - hotfix: 修复 master 上的问题, 等不及 release 版本就必须马上上线. 基于 master, 完成后 merge回 master 和 develop
