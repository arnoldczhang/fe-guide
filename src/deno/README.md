# deno

## 参考
- [deno](http://www.ruanyifeng.com/blog/2020/01/deno-intro.html)
- [官网](https://github.com/denoland/deno/releases)
- [deno-std](https://deno.land/std@0.88.0/node)

## 安装
> curl -fsSL https://deno.land/x/install/install.sh | sh -s v0.31.0

---

## 配置

### 注入bash
> vim $HOME/.bash_profile
>
> export DENO_INSTALL="/Users/arnoldzhang/.local"
>
> export PATH="$DENO_INSTALL/bin:$PATH"
>

### 同步
> source $HOME/.bash_profile

### 试运行
- deno -h

---

## 开发模块
[如何发布一个deno模块](https://dev.to/craigmorten/how-to-publish-deno-modules-2cg6)

