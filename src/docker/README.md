# docker

## 参考
- [docker入门](https://segmentfault.com/a/1190000018810837?utm_medium=hao.caibaojian.com&utm_source=hao.caibaojian.com&share_user=1030000000178452)
- [docker运行vue项目](https://juejin.im/post/5db9474bf265da4d1206777e?utm_source=gold_browser_extension)
- [docker指南](https://www.robertcooper.me/docker-guide)
- [docker中文字符集配置](https://cloud.tencent.com/developer/article/1507591)
- [docker-安装nginx](https://mp.weixin.qq.com/s?__biz=Mzg3OTYzMDkzMg==&mid=2247496729&idx=1&sn=42c89edd613f51b262b09c6821c84c49)

---

## 目录
<details>
<summary>展开更多</summary>

* [`安装docker`](#安装docker)
* [`安装jenkins`](#安装jenkins)
* [`docker命令`](#docker命令)
* [`docker原理`](#docker原理)

</details>

---

## 安装docker

1. [下载](https://www.runoob.com/docker/macos-docker-install.html)
2. [搜索镜像](https://hub.docker.com/)

### 常用命令
```
// 进入docker
docker exec -it jenkins_node /bin/bash
// 如果提示【/bin/bash not found】
docker exec -it prometheus /bin/sh

// 使docker获得root权限
sudo docker container ls  // 获得容器container_id
sudo docker exec -ti -u root 7509371edd48 bash

// docker调用`apt-get install vi`失败
apt-get update
wget
yum
brew

// ssh
openssh-clients

// 查看端口占用
lsof -i tcp:8080

kill pid
```

---

### 安装jenkins
```cmd
docker run --name jenkins_node -d -v /Users/arnoldzhang/Documents/docker/jenkins_home:/var/jenkins_home -p 8081:8080 -p 50000:50000 jenkins/jenkins:lts
```

### 获取管理员密码
```cmd
cat /Users/arnoldzhang/Documents/application/docker/jenkins_home/secrets/initialAdminPassword
```

---

### 创建bridge网络
```cmd
// 查看可用网络
// bridge: 即桥接网络，以桥接模式连接到宿主机
// host: 宿主网络，即与宿主机共用网络
// none: 无网络，容器将无法联网
docker network list

// 创建新的桥接网络
docker network create --driver bridge my-network

// 获取node-exporter的ip
ping node-exporter
// 获取宿主机的ip
ping host.docker.internal
```

### 安装prometheus
```cmd
docker rm -f prometheus
docker run --name=prometheus -d \
-p 9090:9090 \
-v /Users/arnoldzhang/Documents/docker/prometheus/prometheus.yml:/etc/prometheus/prometheus.yml \
-v /Users/arnoldzhang/Documents/docker/prometheus/server/rules.yml:/etc/prometheus/rules.yml \
prom/prometheus:v2.7.2 \
--config.file=/etc/prometheus/prometheus.yml \
--web.enable-lifecycle

docker stop prometheus

docker run --name prometheus -d -p 9090:9090  -v /Users/arnoldzhang/Documents/docker/prometheus:/var/promethues \
-v /Users/arnoldzhang/Documents/docker/prometheus/prometheus.yml:/etc/prometheus/prometheus.yml \
prom/prometheus --config.file=/etc/prometheus/prometheus.yml \
--web.enable-lifecycle


docker run --name prometheus -p 9090:9090 -v /Users/arnoldzhang/Documents/docker/prometheus/prometheus.yml:/etc/prometheus/prometheus.yml prom/prometheus



docker run --name prometheus -d -p 9090:9090 -v /Users/arnoldzhang/Documents/docker/prometheus/prometheus.yml prom/prometheus:v2.7.2


docker run --name=prometheus -d -p 9090:9090 \
-v /Users/arnoldzhang/Documents/docker/prometheus/prometheus.yml:/etc/prometheus/prometheus.yml \
--web.enable-lifecycle \
prom/prometheus


docker run --name prometheus -dit --network my-network -d -p 9090:9090 \
-v /Users/arnoldzhang/Documents/docker/prometheus/prometheus.yml:/etc/prometheus/prometheus.yml \
-v /Users/arnoldzhang/Documents/docker/prometheus/server/rules.yml:/etc/prometheus/rules.yml \
prom/prometheus:v2.7.2

```

### 安装 pushgateway
```cmd
docker run -d -p 9091:9091 -dit --network my-network --name pushgateway prom/pushgateway


cat <<EOF | curl --data-binary @- http://localhost:9091/metrics/job/cqh/instance/test \
# 锻炼场所价格
muscle_metric{label="gym"} 8800
# 三大项数据 kg
bench_press 100
dead_lift 1060
deep_squal 190
EOF
```

### 安装node-exporter
```cmd
docker run -d \
--name=node-exporter \
-p 9100:9100 \
-dit --network my-network \
prom/node-exporter
```

### 安装alertmanager
```cmd
docker run -d -p 9093:9093 \
--name alertmanager \
-dit --network my-network \
-v /Users/arnoldzhang/Documents/docker/prometheus/alertmanager/alertmanager.yml:/etc/alertmanager/alertmanager.yml \
prom/alertmanager
```

### 安装grafana
```cmd
docker run -d -p 3000:3000 \
-dit --network my-network \
--name grafana grafana/grafana
```

---

## docker命令

```sh
docker pull centos:7
# 新建容器，将容器的3000 端口映射到本机的8000 端口
docker container run -p 8000:3000 -it centos:7 /bin/bash

# 查看内存占用
top -p 5140
```


### sonarqube
https://www.testim.io/blog/sonarqube-javascript/



---



## centos命令

```sh
# 查看系统版本
cat /etc/os-release

# 安装xrandr
yum install xorg-x11-server-utils.x86_64

# 通过 Xvfb 设置屏幕分辨率
Xvfb -screen 0 1536x960x16 :99 &
```

---

## docker原理

- namespace：实现资源隔离
- control group：实现容器进程资源限制
- unionFS：实现容器文件系统分层存储、写时复制、镜像合并