import {
    Type,
    TableOption,
    CommonKey,
    CO,
} from './index.d';

const isUndef = <T = any>(val: T) => typeof val === 'undefined';

function setHeader(
    this: TableOption,
    header: CommonKey,
) {
    this.header = header;
    return this.header;
}

function setChildren(
    this: TableOption,
    ...args: TableOption[] | TableOption[][] | Function[]
) {
    const [arg] = args;
    if (Array.isArray(arg) || typeof arg === 'function') {
        this.children = arg;
    } else {
        this.children = args as TableOption[];
    }
    return this.children;
}

function setProps(
    this: TableOption | CommonKey,
    props: CO,
) {
    this.$props = {
        ...this.$props,
        ...props,
    };
    return this.$props;
}

function setListeners(
    this: TableOption | CommonKey,
    listeners: CO,
) {
    this.$listeners = {
        ...this.$listeners,
        ...listeners,
    };
    return this.$listeners;
}

function setRules(
    this: TableOption,
    ...args: Function[] | Function[][]
) {
    const [arg] = args;
    if (Array.isArray(arg)) {
        this.rules = arg;
    } else {
        this.rules = args as Function[];
    }
    return this.rules;
}

/**
 * 表头设置
 * @param props 
 * @param listeners 
 */
export function useHeader(
    props?: CO | Function | undefined,
    listeners?: CO | undefined,
) {
    const header = {
        $props: isUndef(props) ? {} : props,
        $listeners: isUndef(listeners) ? {} : listeners,
    };

    return {
        header,
        setProps: setProps.bind(header),
        setListeners: setListeners.bind(header),
    };
}

/**
 * 表栏设置（不局限于单表栏<->单元素，支持多元素）
 * @param key 
 * @param type 
 * @param pure 
 */
export function useColumn(
    key: string,
    type: Type,
    pure?: boolean,
) {
    const column = {
        key,
        type,
        pure: pure || false,
    };

    return {
        column,
        setHeader: setHeader.bind(column),
        setRules: setRules.bind(column),
        setProps: setProps.bind(column),
        setListeners: setListeners.bind(column),
        setChildren: setChildren.bind(column),
    };
}

/**
 * 表格整体设置
 * @param props 
 * @param listeners 
 */
export function useTable(
    props?: CO | Function | undefined,
    listeners?: CO | undefined,
) {
    const table = {
        $props: isUndef(props) ? {} : props,
        $listeners: isUndef(listeners) ? {} : listeners,
    };

    return {
        table,
        setProps: setProps.bind(table),
        setListeners: setListeners.bind(table),
    };
}

/**
 * 分页器设置
 * @param props 
 * @param listeners 
 */
export function usePagination(
    props?: CO | Function | undefined,
    listeners?: CO | undefined,
) {
    const pagination = {
        $props: isUndef(props) ? {} : props,
        $listeners: isUndef(listeners) ? {} : listeners,
    };

    return {
        pagination,
        setProps: setProps.bind(pagination),
        setListeners: setListeners.bind(pagination),
    };
}
