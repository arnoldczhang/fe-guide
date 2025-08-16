type SendMailParam = {
  to?: string; // 收件人（们）
  subject: string; // 主题
  html: string; // html
  callback?: Function;
  fallback?: Function;
}

type CellType = 'link' | 'number';

type TableCell = {
  key: string; // 唯一标识
  label: string; // 单元格文案
  linkLabel?: string; // 当单元格类型是link时，用于a链接的文案
  type?: CellType; // 单元格类型
}

type TableData = {
  title: string; // 卡片标题
  column: Array<TableCell>; // table栏位配置
  list: Array<ICO>; // 键值要和 TableCell 的 key 对应
}
