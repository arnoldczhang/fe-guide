import {
  Component,
  Prop,
  Vue,
  Watch,
} from 'vue-property-decorator';
import {
  TableOption,
  TableScope,
  TableConfig,
  CO,
} from './index.d';
import {
  INITIAL_SYMBOL,
  SCOPE_TYPE,
  SCOPE_WRAPPER_NAME,
  SLOT_HEADER,
  tableDefaultSlots,
} from './const';
import { ElForm } from 'element-ui/types/form';
import { ElTable } from 'element-ui/types/table';

const isTrue = (list: boolean[]) => list.every(v => v);

@Component({
  components: {
  },
})
export default class SmartTable extends Vue {
    name = 'SmartTable';

    componentName = 'SmartTable';
    // 表格数据
    dataList = [];
    // 错误信息和row对象绑定
    cachedErrorMap = new Map();
    // 错误信息
    errorList = [];

    @Prop({
      default: () => ({}),
    })
    readonly config!: TableConfig;

    @Watch('config.data', { immediate: true, deep: true })
    async handleDataChanged(data: CO[] | Function) {
      if (typeof data === 'function') {
        try {
          const result = await data();
          this.dataList = result;
        } catch (err) {
          this.dataList = [];
        }
      } else {
        this.dataList = data;
      }
      this.updateErrorList();
    }

    get form() {
      return {
        dataList: this.dataList,
      };
    }

    get pagination() {
      return this.config.pagination;
    }

    get table() {
      return this.config.table || {};
    }

    get rules() {
      const { columnInfo } = this;
      return columnInfo.reduce((
        currentRules: (string[] | Function[])[],
        column: TableOption | TableOption[] | string,
      ) => {
        if (typeof column === 'object') {
          let tempColumn = column;
          if (!Array.isArray(tempColumn)) {
            tempColumn = [tempColumn];
          }

          tempColumn.forEach((col: TableOption | string) => {
            if (typeof col !== 'string') {
              const { key, rules } = col;
              let colRule = [];
              if (typeof rules === 'string') {
                colRule = [rules];
              } else if (Array.isArray(rules)) {
                colRule = rules;
              }
              currentRules[key] = colRule;
            }
          });
        }
        return currentRules;
      }, []);
    }

    get columnInfo() {
      return this.config.column;
    }

    hasSlot(key: string) {
      return !tableDefaultSlots.includes(key)
            && (this.$scopedSlots[key] || this.$slots[key]);
    }

    getTableCellError(
      error: string | any[] | undefined,
    ) {
      if (typeof error === 'string') {
        return error;
      }
    }

    updateErrorList() {
      const {
        dataList = [],
        errorList = [],
        cachedErrorMap,
      } = this;

      const cachKeys = [...cachedErrorMap.keys()];
      cachKeys.forEach((key: CO) => {
        // 删除无用的row错误提示
        if (!dataList.includes(key)) {
          const error = cachedErrorMap.get(key);
          errorList.splice(errorList.findIndex(val => val === error), 1);
          cachedErrorMap.delete(key);
        }
      });

      dataList.forEach((data: CO) => {
        // 添加新增的row错误提示
        if (!cachedErrorMap.has(data)) {
          const keys = Object.keys(data);
          const error = keys.reduce((err: CO, key: string) => ({
            ...err,
            [key]: '',
          }), {
            [INITIAL_SYMBOL]: true,
          });
          cachedErrorMap.set(data, error);
          errorList.push(error);
        }
      });
    }

    getTableInfo<T extends TableOption>(
      column: T | T[] | string,
    ) {
      let col = column;
      if (Array.isArray(column) && column.length) {
        [col] = column;
      }

      if (typeof col === 'string') {
        return {
          $props: { label: col },
          $listeners: {},
        };
      }

      if ('header' in col) {
        const { header } = col;
        if (typeof header === 'string') {
          return {
            $props: { label: header },
            $listeners: {},
          };
        }
        return header;
      }

      if (!Array.isArray(col)) {
        return {
          $props: { label: col.key },
        };
      }

      return {};
    }

    getTableProperty<T extends TableOption>(
      column: T | T[] | string,
    ) {
      if (typeof column === 'string') {
        return column;
      }

      if (Array.isArray(column)) {
        return column[0].key;
      }
      return column.key;
    }

    getTableProps<T extends TableOption>(
      column: T | T[] | string,
    ) {
      const { $props } = this.getTableInfo(column);
      return $props || {};
    }

    getTableListeners<T extends TableOption>(
      column: T | T[] | string,
    ) {
      const { $listeners } = this.getTableInfo(column);
      return $listeners || {};
    }

    getValidateMethod(
      col: TableOption,
      scope: TableScope,
    ) {
      const { key } = col;
      const { $index, row } = scope;
      // 当前单元格校验
      const validate = async <T = any>(...args: T[]) => {
        return this.updateRuleMessage({
          index: $index,
          key,
          value: row[key],
          row,
        }, ...args);
      };
        // 当前单元格所在行的某个其他key校验
      const validateLine = async <T = any>(
        colKey: string,
        ...args: T[]
      ) => {
        if (!colKey) {
          throw new Error('缺少参数：colKey，无法定位到当前行数据');
        }
        return this.updateRuleMessage({
          index: $index,
          key: colKey,
          value: row[colKey],
          row,
        }, ...args);
      };
        // 当前单元格key在其他行的校验
      const validateColumn = (index?: number) => {
        return this.validateCell(key, index);
      };

      return {
        validate,
        validateLine,
        validateColumn,
      };
    }

    /**
     * 修正经过ScopeWrapper包过后的this指向
     */
    getParentContext() {
      const {
        $vnode: {
          context,
        },
      } = this;
      const { $vnode: { tag }, $parent } = context;

      if (tag.indexOf(SCOPE_WRAPPER_NAME) > -1) {
        return $parent;
      }
      return context;
    }

    getVueComponent(
      col: TableOption,
      scope: TableScope,
    ) {
      const { type, $props, $listeners } = col;
      const { errorList } = this;
      const { $index } = scope;
      const attrs = {
        scope,
        error: errorList[$index] || {},
        ...this.getColumnProps($props, scope),
        ...this.getColumnListeners($listeners, scope),
      };

      return {
        render: h => h(type, { attrs }),
      };
    }

    getVueRender(
      col: TableOption,
      scope: TableScope,
    ) {
      const { type, $props, $listeners } = col;
      const { $index } = scope;
      const { errorList } = this;
      const newScope = {
        ...scope,
        error: errorList[$index] || {},
        $props: this.getColumnProps($props, scope),
        $listeners: this.getColumnListeners($listeners, scope),
        ...this.getValidateMethod(col, scope),
      };

      if (
        typeof type === 'function'
                || typeof type === 'string'
                || typeof type === 'symbol'
      ) {
        return;
      }

      const { render: oldRender } = type;
      const context = this.getParentContext();
      // 扩展默认scope，返回当前行的异常情况，以及单元格的$props和$listeners
      return {
        render: (h: Vue.CreateElement) => oldRender.call(context, h, newScope),
      };
    }

    /**
     * 如果是通过scope-slot插入的
     * @param col 
     */
    isScopeType(
      col: TableOption,
    ) {
      const { type } = col;
      return type === SCOPE_TYPE;
    }

    getColumnType(
      col: TableOption,
      scope: TableScope,
    ) {
      const { type } = col;

      if (!type || this.isScopeType(col)) {
        return null;
      }

      if (typeof type === 'string') {
        return type;
      }

      if (typeof type === 'function') {
        return this.getVueComponent(col, scope);
      }

      return this.getVueRender(col, scope);
    }

    /**
     * 校验column是否需要插入其对应的slot="header"
     * 参考：https://element.eleme.cn/#/zh-CN/component/table#table-column-scoped-slot
     * 
     * 校验条件：
     * - 有对应$scopedSlots.header
     * - column.$props设置了SLOT_HEADER
     * 
     * @param column 
     */
    hasColumnHeader<T extends TableOption>(
      column: T[] | T | undefined,
    ) {
      if (typeof column === 'undefined') {
        return;
      }

      if (Array.isArray(column)) {
        column = column[0];
      }

      return this.$scopedSlots.header
        && this.getTableProps(column)[SLOT_HEADER];
    }

    getParentColumn<T extends TableOption>(
      column: T[] | undefined,
    ) {
      if (Array.isArray(column)) {
        return column;
      }
      return [column];
    }

    getChildColumn<T extends TableOption>(
      children: T[] | Function,
      scope: TableScope,
    ) {
      if (typeof children === 'function') {
        return children(scope);
      }

      if (Array.isArray(children)) {
        return children;
      }
      return [];
    }

    /**
     * 获取key对应的rules运行后的message
     *
     * rules运行的入参如下：
     * - value：当前key对应的值
     * - row：当前所在行值
     * - column：当前所在列值
     * - ...args：其他手动入参（validateAll时无效）
     *
     * @param props
     * @param args
     */
    async getRuleMessage<T = string>(
      props: {
        key: string;
        value: T;
        row: CO<T>;
      },
      ...args: any[]
    ) {
      const {
        $vnode: {
          context,
        },
        rules,
      } = this;
      const {
        key,
        value,
        row,
      } = props;
      let message = '';
      let targetRule = rules[key];
      const column = this.dataList.map(data => data[key]);
      const ruleArgs = [value, row, column, ...args];
      targetRule = Array.isArray(targetRule) ? targetRule : [];
      for (let rule of targetRule) {
        if (typeof rule === 'string') {
          rule = context[rule];
        }

        if (typeof rule === 'function') {
          message = await rule.apply(context, ruleArgs);
        }

        if (message) {
          break;
        }
      }
      return message;
    }

    /**
     * 根据message校验规则，目前支持以下几种：
     *
     * - 如果是数组，数组内所有message都是空则表示通过
     * - 如果是对象，对象内所有键值里的message都是空则表示通过
     * - 如果都不是，message是空（''、null、undefined、false）即通过
     *
     * @param msg
     */
    checkMsgValid(msg: string | any[] | CO | null | undefined) {
      if (!msg) {
        return true;
      }

      if (Array.isArray(msg)) {
        return msg.every(this.checkMsgValid);
      }

      if (msg && typeof msg === 'object') {
        return Object.keys(msg).every(
          (key: string) => this.checkMsgValid(msg[key])
        );
      }
      return false;
    }

    async updateRuleMessage<T = string>(
      property: {
        index: number;
        key: string;
        value: T;
        row: CO<T>;
      },
      ...args: any[]
    ) {
      const { index, key, value, row } = property;
      const message = await this.getRuleMessage({ key, value, row }, ...args);
      this.errorList[index][INITIAL_SYMBOL] = false;
      this.$set(this.errorList[index], key, message);
      return this.checkMsgValid(message);
    }

    hasRowMessage(
      index: number,
      exceptKey: string | undefined,
    ) {
      if (typeof exceptKey === 'string') {
        const error = this.errorList[index];
        if (error[exceptKey]) {
          return false;
        }

        return Object.keys(error)
          .filter((key: string) => key !== exceptKey)
          .some(
            (key: string) => error[key] || typeof error[key] === 'number'
          );
      }
    }

    /**
     * 准备scope-slot的参数
     * @param col 
     * @param scope 
     */
    getScopedColumnProps(
      col: TableOption,
      scope: TableScope,
    ) {
      const { errorList } = this;
      const { row, column, $index } = scope;
      return {
        row,
        column,
        $index,
        error: errorList[$index] || {},
        props: this.getColumnProps(col.$props, scope),
        ...this.getValidateMethod(col, scope),
      };
    }

    getColumnProps(
      props: CO | Function,
      scope: TableScope,
    ) {
      const {
        $vnode: {
          context,
        },
      } = this;
      if (typeof props === 'function') {
        return props.call(context, scope);
      }
      return props;
    }

    getColumnListeners(
      listeners: Record<string, Function> | undefined,
      scope: TableScope,
    ) {
      const {
        columnInfo,
      } = this;
      const {
        row,
        column: {
          property: key,
        },
      } = scope;
      const column = columnInfo[key];
      const empty = {};
      return Object.keys(listeners || empty).reduce((
        newListeners: CO<Function>,
        name: string,
      ) => {
        const oldListener = listeners[name];
        const context = this.getParentContext();
        newListeners[name] = (event: Event) => {
          oldListener.call(context, row[key], {
            ...scope, column, event,
            ...this.getValidateMethod({ key }, scope),
          });
        };
        return newListeners;
      }, empty);
    }

    bindContextListeners(listeners = {}) {
      const {
        $vnode: {
          context,
        },
      } = this;
      return Object.keys(listeners)
        .reduce((res: CO, key: string) => {
          const oldListener = listeners[key];
          res[key] = (...args: any[]) => {
            return oldListener.call(context, ...args);
          };
          return res;
        }, {});
    }

    /**
     * 以下为对外暴露方法
     */

    async validateCell(
      key: string,
      index?: number,
    ) {
      // 单元格检查
      if (typeof index === 'number') {
        const data = this.dataList[index];
        return this.updateRuleMessage({
          index,
          key,
          value: data[key],
          row: data,
        });
      }
      // 列检查
      return Promise.all(
        this.dataList.map((data: CO, idx: number) =>
          this.updateRuleMessage({
            index: idx,
            key,
            value: data[key],
            row: data,
          })
        )
      ).then(isTrue);
    }

    async validateRow(index: number) {
      const data = this.dataList[index];
      if (typeof data === 'object') {
        return Promise.all(
          Object.keys(data).map((key: string) =>
            this.updateRuleMessage({
              index,
              key,
              value: data[key],
              row: data,
            })
          )
        ).then(isTrue);
      }
      return Promise.reject('当前索引无行信息');
    }

    async validateAll(callback?: Function) {
      const result = await Promise.all(
        this.dataList.map((data: CO, index: number) =>
          this.validateRow(index)
        )
      ).then(isTrue);

      if (typeof callback === 'function') {
        callback(result, this.errorList);
      }
      return Promise.resolve(result);
    }

    getErrorList() {
      return this.errorList;
    }

    getData() {
      return this.dataList;
    }

    clearValidate() {
      (this.$refs.smartForm as ElForm).clearValidate();
    }

    clearSelection() {
      (this.$refs.smartTable as ElTable).clearSelection();
    }

    toggleRowSelection(rows, selected = true) {
      (this.$refs.smartTable as ElTable).toggleRowSelection(rows, selected);
    }

    doLayout() {
      (this.$refs.smartTable as ElTable).doLayout();
    }
}
  