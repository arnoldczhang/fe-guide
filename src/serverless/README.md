# serverless

## 参考
- [solid](https://learnsolid.cn/)

## 名词解释

**FAAS - Function as a service**

函数即服务，每一个函数都是一个服务，函数可以由任何语言编写，除此之外不需要关心任何运维细节，比如：计算资源、弹性扩容，而且可以按量计费，且支持事件驱动。业界大云厂商都支持 FAAS，各自都有一套工作台、或者可视化工作流来管理这些函数。

**BAAS - Backend as a service**

后端及服务，就是集成了许多中间件技术，可以无视环境调用服务，比如数据即服务（数据库服务），缓存服务等。虽然下面还有很多 XASS，但组成 Serverless 概念的只有 FAAS + BAAS。

**PAAS - Platform as a service**

平台即服务，用户只要上传源代码就可以自动持续集成并享受高可用服务，如果速度足够快，可以认为是类似 Serverless。但随着以 Docker 为代表的容器技术兴起，以容器为粒度的 PASS 部署逐渐成为主流，是最常用的应用部署方式。比如中间件、数据库、操作系统等。

**DAAS - Data as a service**

数据即服务，将数据采集、治理、聚合、服务打包起来提供出去。DASS 服务可以应用 Serverless 的架构。

**IAAS - Infrastructure as a Service**

基础设施即服务，比如计算机存储、网络、服务器等基建设施以服务的方式提供。

**SAAS - Software as a Service**

软件即服务，比如 ERP、CRM、邮箱服务等，以软件为粒度提供服务。

## 架构
![通用serverless架构](通用serverless架构.jpg)