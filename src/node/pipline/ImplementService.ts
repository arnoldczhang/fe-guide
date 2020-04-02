import AbstractPipeLineService from './AbstractPipeLineService';

export default class ImplementService extends AbstractPipeLineService {
  async someFn(param): Promise<any> {
    const compiler: PipeLineCompiler = {
      compile(param) {
        // do something
      },
    };

    return this.inject(compiler)
      .param(param)
      .hook(this.hookName.eachAssembled, (fn: Function) => console.log(fn.name))
      .repeatSyncAssemble(
        // service1
        // service2
        // service3
      )
      .run();
  }
}
