interface ISourceOption {
  // 重试次数，默认0次
  retryTimes?: boolean|number;
  // 过滤器，符合条件的 url 会跳过 sourcemap 转换，默认不做过滤
  filter?: string|RegExp|Function;
  // 请求最大耗时，默认3000毫秒
  maxTimeout?: number;
}
