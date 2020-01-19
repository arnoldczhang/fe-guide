# echart

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