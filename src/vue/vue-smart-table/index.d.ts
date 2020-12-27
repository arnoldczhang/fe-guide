export interface CO<T = any> {
    [key: string]: T;
}
export interface CommonKey {
    $props?: CO;
    $listeners?: CO<Function>;
}

export type Type = string | { render: (h: Vue.CreateElement, scope?: TableScope) => Vue.VNode | Vue.VNode[] };

export interface TableOption extends CommonKey {
    key: string;
    type?: Type;
    // true: 纯自定义组件（不会包el-form-item）
    pure?: boolean;
    header?: CommonKey | string;
    rules?: string | (Function | string)[];
    children?: TableOption[] | Function;
}

export interface TableScope extends CommonKey {
    row: CO;
    column: CO;
    $index: number;
    error?: CO[];
    validate?: Function;
}

export interface TableConfig {
    table?: CommonKey;
    pagination?: CommonKey;
    column: (TableOption | string | TableOption[])[];
    data: object[];
}
