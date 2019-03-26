const os = require('os');

/*
cpu时间参数：
{
  user: 393628640,
  nice: 0,
  sys: 256627310,
  idle: 1712638460,
  irq: 0
}
 */
const cpus = os.cpus();
const cpuTimes = cpus.map(cpu => cpu.times);

const {
  rss, // 表示node进程占用的内存总量
  heapUsed, // 表示堆内存的总量
  heapTotal, // 实际堆内存的使用量
  external, // 外部程序的内存使用量，包含Node核心的C++程序的内存使用量
} = process.memoryUsage();
// 获取系统空闲内存
const sysFree = os.freemem();
// 获取系统总内存
const sysTotal = os.totalmem();







