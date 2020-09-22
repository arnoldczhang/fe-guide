# g2

## g2使用
```js
import { Chart } from '@antv/g2';

const chart = new Chart({
  container: 'chart',
  autoFit: true,
  height: 500,
});
chart.data(xxxData)
  .scale({
    key1: {
      min: 0,
      max: 150,
    },
  })
  .line()
  .position('key1*key2');
chart.render();
```

## g2plot使用

```vue
<template>
  <div>
    <div id="chart"> </div>
  </div>
</template>
<script>
import { Bar } from '@antv/g2plot';

export default {
  data() {
    return {
      mockData: [
        { year: '1951 年', sales: 38 },
        { year: '1952 年', sales: 52 },
        { year: '1956 年', sales: 61 },
        { year: '1957 年', sales: 145 },
        { year: '1958 年', sales: 48 },
      ],
    };
  },
  mounted() {
    if (this.$refs.chart) {
      this.chart = new Bar('chart', {
        data: this.mockData,
        xField: 'sales',
        yField: 'year',
        colorField: 'year',
      });
      this.chart.render();
    }
  },
}
</script>
```
