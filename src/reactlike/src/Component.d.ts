import { VNode } from '../src/interface';
export default class  {
    props: any;
    context: Object | null;
    children: Array<VNode> | null;
    constructor(props: any, context: Object | null, ...children: Array<VNode> | null);
    shouldComponentUpdate(): boolean;
    componentDidMount(): void;
    setState(state: Object, callback: Function | null): void;
}
