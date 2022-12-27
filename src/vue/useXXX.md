# useXXX



[TOC]

## useQuery

### stale-while-revalidate策略

**staleTime**

缓存有效期。在有效期内，相同请求参数都会走缓存（若有），超时删除。



**cachTime**

非激活时长。超出该时长缓存未被使用时，缓存就会被清除。



**refetch while focus**

视窗激活重新请求，会出现频繁请求的现象，但是有缓存有效期的控制，能缓解；

也可以通过**refetchInterval**限制



### 兜底数据

请求中，基于 query param 可以预设默认返回值，请求结束后替换。



### 连续性or独立性

相同请求依次请求，或者独立请求