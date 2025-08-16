# deno

## 参考
- [deno](http://www.ruanyifeng.com/blog/2020/01/deno-intro.html)
- [官网](https://github.com/denoland/deno/releases)
- [deno-std](https://deno.land/std@0.88.0/node)
- [deno-db](https://github.com/eveningkid/denodb)
- [deno-examples](https://examples.deno.land/)

---

## 目录

<details>
<summary>展开更多</summary>


* [`安装`](#安装)
* [`配置`](#配置)
* [`开发`](#开发)
* [`框架`](#框架)

</details>

---

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

## 开发
[如何发布一个deno模块](https://dev.to/craigmorten/how-to-publish-deno-modules-2cg6)

---

## 框架

[客户端框架-fresh](https://fresh.deno.dev/docs/introduction)

