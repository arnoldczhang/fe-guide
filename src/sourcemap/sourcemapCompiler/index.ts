import {
  isStr,
  isObj,
  initOptions,
  showError,
} from './utils';
import SourceMapCompiler from './compiler';

/**
 * sourcemap转换
 * @param stack 源码
 * @param options ISourceOption 配置详见d.ts
 */
export default async function transSourcemap(
  stack: string,
  options?: ISourceOption,
): Promise<ICompileResult> {
  if (!isStr(stack)) {
    return showError('stack 需为 string');
  }

  if (!isObj(options || {})) {
    return showError('options 需为 object');
  }
  const compiler = new SourceMapCompiler(stack, initOptions(options));
  await compiler.run();
  return compiler.getResult();
}
