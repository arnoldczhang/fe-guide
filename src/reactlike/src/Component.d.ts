export default class  {
    props: Object;
    context: Object | null;
    constructor(props: Object, context: Object | null);
    shouldComponentUpdate(): boolean;
    componentDidMount(): void;
    setState(state: Object, callback: Function | null): void;
    render(): void;
}
