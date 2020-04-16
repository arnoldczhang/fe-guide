<template>
  <el-container class="tree-node">
    <el-tooltip
      class=""
      effect="dark"
      :content="node.label"
      :open-delay="option.openDelay || 1000"
      placement="bottom"
    >
      <div
        v-if="$scopedSlots['node-tooltip']"
        slot="content"
      >
        <slot name="node-tooltip" :node="node" />
      </div>
      <section
        :class="{'tree-node-line': true, highlight }"
        :style="{marginLeft: `${option.level * 18}px`}"
        @click="() => handleNodeToggle(node, index)"
      >
        <section
          :class="{'tree-node-inner-line': true, highlight }"
          :style="{ width: node.width || '0%' }"
        >
          <span>&nbsp;</span>
        </section>
        <section class="tree-node-inner-line-label">
          <span class="line-label">
            <label :class="{
              'omit-more-1-line line-inner-label': true,
              'line-inner-label-with-icon': node.icon,
              highlight,
            }"
            >{{ node.label }}</label>
            <i v-if="node.icon" :class="{
              [node.icon]: true,
              'line-inner-icon': true,
              highlight,
            }"
            />
          </span>
          <span :class="{'line-inner-quota': true, highlight}">{{ node.quota || '' }}</span>
        </section>
      </section>
    </el-tooltip>
    <el-collapse-transition>
      <section
        v-if="node.children && node.children.length"
        v-show="expanded"
      >
        <tree-node
          v-for="(item, i) in node.children"
          :key="item.label"
          :node="item"
          :index="i"
          :option="nodeOption"
          @node-expand="handleNodeClick"
        />
      </section>
    </el-collapse-transition>
  </el-container>
</template>
<script>

export default {
  name: 'TreeNode',
  componentName: 'TreeNode',
  components: {
  },
  props: {
    index: {
      type: Number,
      default: 0,
    },
    node: {
      type: Object,
      default: () => ({}),
    },
    option: {
      type: Object,
      default: () => ({}),
    },
  },
  data() {
    return {
      expanded: false,
    };
  },
  computed: {
    highlight() {
      return this.option.highlight === this.node.label;
    },
    nodeOption() {
      const { option } = this;
      return {
        ...option,
        level: option.level + 1,
      };
    },
  },
  watch: {
  },
  mounted() {
    this.init();
  },
  methods: {
    init() {
    },
    handleNodeToggle(node, index) {
      this.handleNodeClick(node, index);
      // TODO expanded也可以由外部控制，目前不处理
      this.expanded = !this.expanded;
    },
    handleNodeClick(node, index) {
      this.$emit('node-expand', node, index);
    },
  },
};
</script>
<style lang="less" scoped>
.tree-node {
  display: flex;
  flex-direction: column;
  .tree-node-line {
    &:hover {
      background-color: #eee;
    }
    cursor: pointer;
    -webkit-user-select: none;
    user-select: none;
    border-left: 4px solid #409EFF;
    border-top: 1px solid #ccc;
    border-bottom: 1px solid #ccc;
    margin-top: -1px;
    height: 40px;
    line-height: 40px;
    background-color: #fff;
    position: relative;
    display: flex;
    &.highlight {
      border-left-color: #f56c6c;
    }
    .tree-node-inner-line-label {
      z-index: 1;
      padding-left: 5px;
      display: flex;
      width: 100%;
      justify-content: space-between;
      .line-quota,
      .line-label {
        display: inline-block;
      }
      .line-label {
        max-width: 60%;
        display: flex;
        align-items: center;
        .line-inner-label {
          display: inline-block;
          max-width: 100%;
          &.highlight {
            color: #000;
          }
        }
        .line-inner-label-with-icon {
          max-width: calc(100% - 20px);
        }
      }
      .line-inner-quota {
        padding-right: 5px;
        color: #606266;
        font-weight: bold;
        &.highlight {
          color: #000;
        }
      }
    }
    .tree-node-inner-line {
      position: absolute;
      right: 0;
      top: 0;
      background: #85bdf7;
      &.highlight {
        background-color: #f56c6c!important;
      }
    }
  }
}
.omit-more-1-line {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  cursor: pointer;
  max-width: 80%;
}
</style>
