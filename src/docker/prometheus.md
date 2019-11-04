# prometheus

## 参考
- [教程](https://www.cnblogs.com/chenqionghe/p/10494868.html)

---

## 基本原理
> Prometheus 的基本原理是通过HTTP协议周期性抓取被监控组件的状态，任意组件只要提供对应的HTTP接口就可以接入监控。
>
> 不需要任何SDK或者其他的集成过程。
>
> 这样做非常适合做虚拟化环境监控系统，比如 VM、Docker、Kubernetes 等。

---

## 整体架构
![整体架构](https://img2018.cnblogs.com/blog/662544/201903/662544-20190308115806797-1750460125.png)

---

## 主要套件
- prometheus Server 主要负责数据采集和存储，提供 PromQL 查询语言的支持
- Alertmanager 警告管理器，用来进行报警
- PushGateway 支持临时性 Job 主动推送指标的中间网关
- NodeExporter 可以提供 metrics 给 prometheus Server

---

## 准备工作

### docker
> Docker 在容器的基础上，进行了进一步的封装，从文件系统、网络互联到进程隔离等等，
>
> 极大的简化了容器的创建和维护。
>
> 使得 Docker 技术比虚拟机技术更为轻便、快捷。

#### 安装方式

**brew**

```
brew cask install docker
```

**官网下载**

```
https://download.docker.com/mac/stable/Docker.dmg
```

#### 环境配置
由于 prometheus Server 需要和其他套件和宿主机进行网络通信，可以将这些套件都放在一个网络内

docker 的网络方式分为三种：
- bridge: 即桥接网络，以桥接模式连接到宿主机
- host: 宿主网络，即与宿主机共用网络
- none: 无网络，容器将无法联网

这里可以新建一个 bridge 类型网络：

```
docker network create --driver bridge my-network
```

#### 对比传统虚拟机总结
| 特性 | docker | 虚拟机 |
| -------- | -----:   | :----: |
| 启动 | 秒级 | 分钟级 |
| 硬盘使用 | 一般为`MB` | 一般为`GB` |
| 性能 | 接近原生 | 弱于 |
| 系统支持量 | 单机支持上千个容器 | 一般几十个 |

---

## 安装

### Prometheus Server
```
docker run --name prometheus \
-dit --network my-network \
-d -p 9090:9090 \
-v /Users/arnoldzhang/Documents/docker/prometheus/prometheus.yml:/etc/prometheus/prometheus.yml \
-v /Users/arnoldzhang/Documents/docker/prometheus/server/rules.yml:/etc/prometheus/rules.yml \
prom/prometheus:v2.7.2
```

`prometheus.yml`: 是 Prometheus Server 的全局配置文件，后面会给到最终版

`rules.yml`: 是 Prometheus Server 的其中一个规则文件，后面会给到最终版

`-dit --network my-network`: 使用我们新创建的网络`my-network`

**prometheus Server支持热加载，但是我没试出来...**

### golang客户端
[教程](https://www.cnblogs.com/chenqionghe/p/10494868.html)上有写，但是非必要

### node exporter
```
docker run -d \
--name=node-exporter \
-p 9100:9100 \
-dit --network my-network \
prom/node-exporter
```

### pushgateway
> pushgateway是为了允许临时作业和批处理作业向普罗米修斯公开他们的指标

```
docker run -d -p 9091:9091 \
-dit --network my-network \
--name pushgateway prom/pushgateway
```

支持多种语言sdk推送消息，这里用 shell 举例

```
cat <<EOF | curl --data-binary @- http://localhost:9091/metrics/job/cqh/instance/test \
# 锻炼场所价格
muscle_metric{label="gym"} 8800
# 三大项数据 kg
bench_press 100
dead_lift 360
deep_squal 60
EOF
```

### Grafana
> Grafana是用于可视化大型测量数据的开源程序，它提供了强大和优雅的方式去创建、共享、浏览数据。
>
> 这里可以将 prometheus 作为数据源，添加到 grafana 面板查看

```
docker run -d -p 3000:3000 \
-dit --network my-network \
--name grafana grafana/grafana
```

添加面板方式，可以参考[教程](https://www.cnblogs.com/chenqionghe/p/10494868.html)

### AlterManager
> Pormetheus 的告警由独立的两部分组成
>
> Prometheus Server 中的告警规则发送告警到 Alertmanager
>
> Alertmanager 管理这些告警

```
docker run -d -p 9093:9093 \
--name alertmanager \
-dit --network my-network \
-v /Users/arnoldzhang/Documents/docker/prometheus/alertmanager/alertmanager.yml:/etc/alertmanager/alertmanager.yml \
prom/alertmanager
```

这里可以定义配置文件：`alertmanager.yml`

```
global:
  resolve_timeout: 5m
route:
  group_by: ['cqh']
  group_wait: 10s #组报警等待时间
  group_interval: 10s #组报警间隔时间
  repeat_interval: 10s #重复报警间隔时间
  receiver: 'web.hook'
receivers:
  - name: 'web.hook'
    webhook_configs:
      - url: 'http://192.168.65.2:8888' # 这里的 webhook可以用我们自己的 node-server 接口或后端接口
inhibit_rules:
  - source_match:
      severity: 'critical'
    target_match:
      severity: 'warning'
    equal: ['alertname', 'dev', 'instance']
```

prometheus Server 的规则文件`rules.yml`，这时候也可以配置了：

```
groups:
  - name: cqh
    rules:
      - alert: cqh测试
        expr: dead_lift > 150
        for: 1m
        labels:
          status: warning
        annotations:
          summary: "{{$labels.instance}}:硬拉超标！lightweight baby!!!"
          description: "{{$labels.instance}}:硬拉超标！lightweight baby!!!"
```

**expr 可以用 promQL，下面的`查询语法`会提到**

prometheus Server 的全局配置`prometheus.yml`，这时也能确认了：

```
global:
  scrape_interval:     15s # 默认抓取间隔, 15秒向目标抓取一次数据。
  scrape_timeout:     15s
  external_labels:
    monitor: 'codelab-monitor'
rule_files:
  - '/etc/prometheus/rules.yml'
# 这里表示抓取对象的配置
scrape_configs:
  #这个配置是表示在这个配置内的时间序例，每一条都会自动添加上这个{job_name:"prometheus"}的标签  - job_name: 'prometheus'
  - job_name: 'prometheus'
    scrape_interval: 5s # 重写了全局抓取间隔时间，由15秒重写成5秒
    static_configs:
      - targets: ['localhost:9090']
      - targets: ['192.168.65.2:8080', '192.168.65.2:8081','192.168.65.2:8082']
        labels:
          group: 'client-golang'
      - targets: ['172.18.0.3:9100']
        labels:
          group: 'client-node-exporter'
      - targets: ['172.18.0.2:9091']
        labels:
          group: 'pushgateway'
alerting:
  alertmanagers:
    - static_configs:
        - targets: ["172.18.0.5:9093"]
```

---

## 效果
- demo
- 如果 demo 失败的话，我简单讲下效果：
  1. 首先向 pushgateway 发送新的数据指标，这里看效果，所以直接发送明显异常的指标
  2. 由于在 rules.yml 配置了监控规则，所以在 prometheus 的 Alert 面板会看到警告
  3. 警告持续一定时间（也是在 rules.yml 配置），就会触发 webhook ，请求告警接口
  4. 告警接口可以发邮件、发钉钉、发短信等等

---

## 查询语法
[promQL](https://songjiayang.gitbooks.io/prometheus/content/promql/summary.html)

### 数据类型
字符串和数字

### 查询结果类型
- 瞬时数据 (Instant vector): 包含一组时序，每个时序只有一个点，例如：http_requests_total
- 区间数据 (Range vector): 包含一组时序，每个时序有多个点，例如：http_requests_total[5m]
- 纯量数据 (Scalar): 纯量只有一个数字，没有时序，例如：count(http_requests_total)

### 操作符
- 算术（+，-，*，/，%，^）
- 比较（==，!=，>，<，>=，<=）
- 逻辑（and，or，unless）
- 聚合（sum，min，max，avg，stddev，stdvar，count，count_values，bottomk，topk，quantile）

