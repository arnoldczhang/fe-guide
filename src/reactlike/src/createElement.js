import { isFunction } from './utils';
export default (type, attr, ...children) => {
    let result;
    if (isFunction(type)) {
        result = new type(attr, {}, children);
    }
    else {
        type = type.toUpperCase();
        result = {
            type,
            attr,
            children,
        };
    }
    return result;
};
//# sourceMappingURL=createElement.js.map