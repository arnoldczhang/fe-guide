# img

[TOC]

## 参考
- [图片优化](https://mp.weixin.qq.com/s/euvdMHkYUXHmgkV9D334NQ)
- [canvas做图片压缩](https://segmentfault.com/a/1190000023486410)
- [gif压缩](https://github.com/imagemin/imagemin-gifsicle)

---

## png
> png8、png24、png32
>
> [图片 PNG 格式详解](https://juejin.cn/post/6905635070397612039)

**png8**

- 2的8次方种颜色
- 1位布尔透明通道
- 完全透明/完全不透明，不支持alpha透明

**png24**

- 2的24次方种颜色
- 8位布尔透明通道
- 支持半透明

**png32**

- 2的32次方种颜色
- 16位布尔透明通道
- 支持不同程度的半透明

---

## webp
> 是一种有损压缩

---

## 选型
- 色彩丰富、大图 =》jpg
- 需要动画 =》 gif
- 安卓机 =》webp
- 不需要高分辨率、不需要精确保留细节 =》jpeg
- 需要高分辨率、精确保留细节、不需要真彩色 =》png8
- 需要高分辨率、精确保留细节、真彩色，不需要背景多阶透明 =》 png24
- 需要高分辨率、精确保留细节、真彩色、背景多阶透明 =》 png32

---

## 视频
html的`<video>`仅支持webm和MP4，区别在于：

webm - 支持透明
mp4 - 没有透明通道

### WebCodecs
> chrome 94+
>
> 利用浏览器自带的 FFmpeg，效率高于 webassembly


---

### PAG

> 相比于`lottie`，体积更小，解析时间更短，是个二进制文件。
>
> 腾讯已有[开源产品](https://github.com/tencent/libpag)
