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
} from './const';

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
        default: {},
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

    getTableCellKlass(
        index: number,
        key: string,
    ) {
        return {
            // mb__24px: this.hasRowMessage(index, key),
        };
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
            dataList,
            errorList,
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
                const error = keys.reduce((error: CO, key: string) => ({
                    ...error,
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

    getColumnType(
        col: TableOption,
        scope: TableScope,
    ) {
        const { type, key, $props, $listeners } = col;
        if (typeof type === 'string') {
            return type;
        }

        const {
            $vnode: {
                context,
            },
            errorList,
        } = this;
        const { $index, row } = scope;
        const { render: oldRender } = type;
        const validate = async <T = any>(...args: T[]) => {
            return this.updateRuleMessage({
                index: $index, key, value: row[key],
            }, ...args);
        };
        // 扩展默认scope，返回当前行的异常情况，以及单元格的$props和$listeners
        const render = (h: Vue.CreateElement) => oldRender.call(context, h, {
            ...scope,
            error: errorList[$index] || {},
            $props: this.getColumnProps($props, scope),
            $listeners: this.getColumnListeners($listeners, scope),
            validate,
        });
        return {
            render,
        };
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

    async getRuleMessage<T = string>(
        key: string,
        value: T,
        ...args: any[]
    ) {
        const {
            $vnode: {
                context,
            },
            rules,
        } = this;
        let message = '';
        let targetRule = rules[key];
        targetRule = Array.isArray(targetRule) ? targetRule : [];
        for (let rule of targetRule) {
            if (typeof rule === 'string') {
                rule = context[rule];
            }

            if (typeof rule === 'function') {
                message = await rule.call(context, value, ...args);
            }

            if (message) {
                break;
            }
        }
        return message;
    }

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
        },
        ...args: any[]
    ) {
        const { index, key, value } = property;
        const message = await this.getRuleMessage(key, value, ...args);
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
            $vnode: {
                context,
            },
            columnInfo,
        } = this;
        const {
            row,
            $index: index,
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
            newListeners[name] = (event: Event) => {
                const validate = async <T = any>(...args: T[]) => {
                    return this.updateRuleMessage({
                        index, key, value: row[key]
                    }, ...args);
                };
                oldListener.call(context, row[key], {
                    ...scope, column, validate, event,
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
            });
        }
        // 列检查
        return Promise.all(
            this.dataList.map((data: CO, idx: number) =>
                this.updateRuleMessage({
                    index: idx,
                    key,
                    value: data[key],
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
}
