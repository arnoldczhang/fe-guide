import * as React from 'react';
import { ProviderProps } from './provider-props';
export declare class Provider extends React.Component {
    props: ProviderProps;
    context: Object | null;
    constructor(props: ProviderProps, context: Object | null);
    render(): any;
}
