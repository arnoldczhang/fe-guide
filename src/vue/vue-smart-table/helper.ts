import {
  Type,
  TableOption,
  CommonKey,
  CO,
} from './index.d';
import {
  SCOPE_WRAPPER_NAME,
} from './const';

const isUndef = <T = any>(val: T) => typeof val === 'undefined';

export const noop = <T = any>(v: T) => v;

function setHeader(
  this: TableOption,
  header: CommonKey,
) {
  this.header = header;
  return this.header;
}

function setChildren(
  this: TableOption,
  ...args: TableOption[] | TableOption[][] | Function[] | any[]
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
  this: TableOption | CommonKey | any,
  props: CO | Function,
) {
  if (typeof props === 'function') {
    this.$props = props;
    return this.$props;
  }

  this.$props = {
    ...this.$props,
    ...props,
  };
  return this.$props;
}

function setListeners(
  this: TableOption | CommonKey | any,
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
  props?: CO | Function,
  listeners?: CO,
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
 * @param key 唯一键
 * @param type 元素标签/vue-render/Component
 * @param pure 是否需要form-item校验
 */
export function useColumn(
  key: string,
  type?: Type,
  pure?: boolean,
) {
  if (!String(key)) {
    throw new Error('必须设置column的key');
  }

  const column = {
    key,
    type,
    pure: !type || pure || false,
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
  props?: CO | Function,
  listeners?: CO,
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
  props?: CO | Function,
  listeners?: CO,
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

/**
 * 设置纯文案类型的column
 * @param props 
 */
export function useLabel(
  props: { key: string } & CO,
) {
  const { key, ...otherProps } = props;
  const {
    column,
    setHeader: setLabelHeader,
  } = useColumn(key);

  const {
    header,
  } = useHeader(otherProps);
  setLabelHeader(header);
  return column;
}

/**
 * 更正scope-slot到特定组件
 * @param BaseComp 
 */
export function ScopeWrapper(BaseComp) {
  const Base = typeof BaseComp === 'function'
    ? BaseComp.sealedOptions || BaseComp.options
    : BaseComp;
  return {
    name: SCOPE_WRAPPER_NAME,
    render(
      this: Vue,
      hoc,
    ) {
      const {
        $props,
        $listeners,
        $attrs,
        $vnode: {
          context: {
            $scopedSlots,
            $slots,
          },
        },
      } = this;
      const slots = Object.keys($slots)
        .reduce((arr, k) => arr.concat($slots[k]), [])
        .map(vnode => {
          // feat: 手动更正 context 到高阶组件上
          vnode.context = (this as any)._self;
          return vnode;
        });
      return hoc(Base, {
        on: $listeners,
        props: $props,
        attrs: $attrs,
        // feat: 手动更正 scopedSlots 到高阶组件上
        scopedSlots: $scopedSlots,
      }, slots);
    },
  };
}
