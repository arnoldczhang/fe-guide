import PipeLine from './index';

async function test(param) {
  const pipeline = new PipeLine();
  const compiler = {
    compile() {
      // do something...
    }
  }
  return pipeline.inject(compiler)
  .param(param)
  .hook(pipeline.hookName.eachAssembled, (fn: Function) => console.log(fn.name))
  .repeatSyncAssemble(
    // fn1,
    // fn2,
    // fn3,
  )
  .run();
}

