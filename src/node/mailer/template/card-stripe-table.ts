/* eslint-disable indent */
/**
 * 生成斑马纹表格
 *
 * @param data Object 卡片表格数据
 */
export default (data: TableData): string => {
  const bcolor = '1px solid #ebeef5';
  const { title, column, list } = data;
  return `
  <div>
    <style>
      .bd { border: ${bcolor}; }
      .bdb { border-bottom: ${bcolor}; }
      .pd20 { padding: 20px; }
      .mb20 { margin-bottom: 20px; }
      .br4 { border-radius: 4px; }
      .f18 { font-size: 18px; }
      .cgrey { color: rgb(144, 147, 153);}
      .cgrey-deep { color: rgb(96, 98, 102);}
      .cell { padding: 12px 10px; }
      .shad { box-shadow: 0 2px 12px 0 rgba(0,0,0,.1); }
      .link { color: #67c23a; display: inline-block; min-width: 100px;}
      .of-x-scroll { overflow-x: scroll }
      .omit-1 { overflow: hidden;text-overflow: ellipsis;white-space: nowrap;cursor: pointer;max-width: 500px; }
      .card { width: fit-content; max-width: 1000px; }
      .empty { width: 1000px; text-align: center; }
    </style>
    <div class="card bd br4 shad mb20">
      <div class="bdb" style="padding: 18px 20px;">
        <span class="f18">${title}</span>
      </div>
      <div class="pd20 of-x-scroll">
        <table border="0" cellpadding="0" cellspacing="0">
          <thead>
            <tr bgColor="#fafafa">
              ${column.map(({ label }) => `
                <th class="bdb cgrey cell">${label}</th>
              `).join('')}
            </tr>
          </thead>
          <tbody>
            ${list.length ? list.map((item, i) => `
              <tr ${i % 2 ? 'bgColor="#fafafa"' : ''}>
                ${column.map(({ type, key, linkLabel }) => {
                  const value = item[key] || '无';
                  return `
                    <td class="bdb cgrey-deep cell">
                      ${type === 'link' ? `
                        <a class="link" href="${value}">${linkLabel || '查看'}</a>
                      ` : `
                        <section title="${value}" class="omit-1">${value}</section>
                      `}
                    </td>
                  `;
                }).join('')}
              </tr>
            `).join('') : `
                <tr>
                  <td class="empty bdb cgrey-deep cell" colspan="${column.length}">暂无数据</td>
                </tr>
            `}
          </tbody>
        </table>
      </div>
    </div>
  </div>
  `;
};
