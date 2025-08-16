# echarts

## 参考

- [基于echarts的可视化大屏](https://github.com/food-billboard/create-chart)

## 用法

### 任意位置markline
```js
option = {
    title: {
        text: '未来一周气温变化',
        subtext: '纯属虚构'
    },
    tooltip: {
        trigger: 'axis'
    },
    legend: {
        data:['最高气温','最低气温']
    },
    grid: {
        // left: 60
    },
    toolbox: {
        show: true,
        feature: {
            dataZoom: {
                yAxisIndex: 'none'
            },
            dataView: {readOnly: false},
            magicType: {type: ['line', 'bar']},
            restore: {},
            saveAsImage: {}
        }
    },
    xAxis:  {
        type: 'category',
        boundaryGap: false,
        data: ['周一','周二','周三','周四','周五','周六','周日']
    },
    yAxis: {
        type: 'value',
        axisLabel: {
            formatter: '{value} °C'
        }
    },
    series: [
        {
            name:'最低气温',
            type:'line',
            data:[1, -2, 2, 5, 3, 2, 0],
            markPoint: {
                data: [
                    {name: '周最低', value: -2, xAxis: 1, yAxis: -1.5}
                ]
            },
            markLine: {
                symbol: ['none', 'none'],
                itemStyle: {
                    normal: {
                      lineStyle: {
                        type: 'dashed',
                        color: '#999',
                      },
                    },
                },
                label: {
                    show: true,
                    color: 'red',
                },
                data: [

                    [{
                        // symbol: 'none',
                        label: {
                            normal: {
                                position: 'start',
                                
                                formatter: '最大值'
                            }
                        },
                        x: '20%',
                        y: '10%',
                    }, {
                        // symbol: 'none',
                        x: '20%',
                        y: '90%',
                        
                    }],
                    [{
                        // symbol: 'none',
                        label: {
                            normal: {
                                position: 'start',
                                formatter: '最大值'
                            }
                        },
                        x: '422',
                        y: '10%',
                    }, {
                        // symbol: 'none',
                        x: '422',
                        y: '70%',
                        
                    }]
                ]
            }
        }
    ]
};
```

### 获取x轴坐标点精确距离
```js
const startWidth = this.myChart.convertToPixel(
  { xAxisIndex: 0 },
  String(xAxisValue)
);
```

### 柱状图+折线图（支持区间缩放）
```js
option = {
    tooltip: {
    },
    toolbox: {
        feature: {
        }
    },
    legend: {
        data: ['蒸发量', '降水量', '平均温度']
    },
    xAxis: [
        {
            type: 'category',
            data: ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'],
            axisPointer: {
                type: 'shadow'
            }
        }
    ],
    yAxis: [
        {
            type: 'value',
            name: '水量',
            min: 0,
            max: 250,
            interval: 50,
            axisLabel: {
                formatter: '{value} ml'
            }
        },
        {
            type: 'value',
            name: '温度',
            min: 0,
            max: 25,
            interval: 5,
            axisLabel: {
                formatter: '{value} °C'
            }
        }
    ],
    dataZoom: [
        {
            show: true,
            start: 50,
            end: 100
        },
    ],
    series: [
        {
            name: '蒸发量',
            type: 'bar',
            data: [2.0, 4.9, 7.0, 23.2, 25.6, 76.7, 135.6, 162.2, 32.6, 20.0, 6.4, 3.3]
        },
        {
            name: '平均温度',
            type: 'line',
            yAxisIndex: 1,
            data: [2.0, 2.2, 3.3, 4.5, 6.3, 10.2, 20.3, 23.4, 23.0, 16.5, 12.0, 6.2]
        }
    ]
};
```

### 中国地图
```js
import 'echarts/map/js/china.js';

export default {
    mounted() {
        loadEcharts((echarts) => {
            this.myChart = echarts.init(this.$refs.map);
            this.myChart.setOption({
                title: {
                    text: '',
                },
                tooltip: {
                    trigger: 'item',
                    formatter({ data }) {
                        if (data) {
                        const { name, value } = data;
                        return `
                            省份: ${name}<br/>
                            次数: ${value}次
                        `;
                        }
                        return '';
                    },
                },
                visualMap: {
                    min: 1,
                    max: 500,
                    text: ['500', '1'],
                    realtime: false,
                    calculable: false,
                    inRange: {
                        color: ['#409EFF', '#53a8ff', '#66b1ff', '#79bbff', '#8cc5ff', '#a0cfff', '#b3d8ff']
                    }
                },
                series: [{
                    type: 'map',
                    name: 'china',
                    mapType: 'china',
                    label: {
                        show: false,
                    },
                    itemStyle: {
                        borderColor: '#ccc',
                    },
                    data: [
                        { name: '内蒙古', value: 1 },
                        { name: '黑龙江', value: 2 },
                    ],
                }],
            });
        });
    },
}
```
