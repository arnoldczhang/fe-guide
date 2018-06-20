export interface VNode {
    attr?: Object | null;
    children?: Array<VNode> | string | null;
    tag?: Function | string | null;
}
