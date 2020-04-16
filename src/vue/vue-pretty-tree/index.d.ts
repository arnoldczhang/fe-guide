interface TreeNode {
  label: string; //  '左侧显示文案'
  quota: string; // '右侧显示数据'
  width: string|number; // '进度宽度'
  icon?: string; // '左侧小图标的class，参考https://element.eleme.cn/#/zh-CN/component/icon'
  children?: TreeNode[];
}

interface TreeOption {
  highlight: string; // 需要高亮的label（应自动expand）
  openDelay: number; // 设置tooltip的open-delay
  level?: number; // 结构层级
  expand: string; // TODO 需要展开的label及其父结构
}
