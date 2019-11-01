# docker

## 参考
- [docker入门](https://segmentfault.com/a/1190000018810837?utm_medium=hao.caibaojian.com&utm_source=hao.caibaojian.com&share_user=1030000000178452)
- [docker运行vue项目](https://juejin.im/post/5db9474bf265da4d1206777e?utm_source=gold_browser_extension)

---

## 目录
<details>
<summary>展开更多</summary>

* [`安装docker`](#安装docker)
* [`安装jenkins`](#安装jenkins)

</details>

---

## 安装docker

1. [下载](https://www.runoob.com/docker/macos-docker-install.html)
2. [搜索镜像](https://hub.docker.com/)

---

### 安装jenkins
```cmd
docker run --name jenkins_node -d -v /Users/arnoldzhang/Documents/docker/jenkins_home:/var/jenkins_home -p 8081:8080 -p 50000:50000 jenkins/jenkins:lts
```

### 获取管理员密码
```cmd
cat /Users/arnoldzhang/Documents/application/docker/jenkins_home/secrets/initialAdminPassword
```
