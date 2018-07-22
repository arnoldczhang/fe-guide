/// <reference types="react" />
import { PureComponent } from 'react';
export declare type Props = Partial<{}>;
export declare type State = Partial<{
    error: any;
}>;
export default class Error extends PureComponent<Props, State> {
    props: Props;
    state: State;
    constructor(props: Props, options: Object);
    componentDidCatch(error: any, errorInfo: any): void;
    render(): any;
}
