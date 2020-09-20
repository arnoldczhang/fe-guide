# g2

## 使用

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
