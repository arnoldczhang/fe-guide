<template>
  <el-container class="pretty-tree">
    <tree-node
      v-for="(item, index) in data"
      :key="item.label"
      :index="index"
      :node="item"
      :option="nodeOption"
      @node-expand="handleClick"
    >
      <template
        v-if="$scopedSlots['tree-tooltip']"
        #node-tooltip="{ node }"
      >
        <slot name="tree-tooltip" :node="node" />
      </template>
    </tree-node>
  </el-container>
</template>
<script>
import TreeNode from './tree-node.vue';

export default {
  name: 'PrettyTree',
  componentName: 'PrettyTree',
  components: {
    'tree-node': TreeNode,
  },
  props: {
    data: {
      type: Array,
      default: () => [],
    },
    option: {
      type: Object,
      default: () => ({}),
    },
  },
  data() {
    return {
      highlight: '',
    };
  },
  computed: {
    nodeOption() {
      const { option, highlight } = this;
      return {
        ...option,
        highlight,
        level: 0,
      };
    },
  },
  mounted() {
    this.init();
  },
  methods: {
    init() {
      console.log(this);
      const { option = {} } = this;
      const {
        highlight,
      } = option;
      this.highlight = highlight;
    },
    handleClick(node, index) {
      this.$emit('node-select', node, index);
      this.highlight = node.label;
    },
  },
};
</script>
<style lang="less" scoped>
.pretty-tree {
  display: flex;
  flex-direction: column;
}
</style>
