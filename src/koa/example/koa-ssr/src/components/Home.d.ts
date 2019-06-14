import * as React from "react";
import { CO, CF, BaseState } from "../types";
interface HomeProps {
    circuits?: Array<CO>;
    fetchData: CF;
}
declare class Home extends React.Component<HomeProps, BaseState> {
    static serverFetch: () => (dispatch: CF) => any;
    constructor(props: HomeProps);
    componentDidMount(): void;
    handleClick(): void;
    render(): JSX.Element;
}
declare const _default: import("react-redux").ConnectedComponentClass<typeof Home, Pick<HomeProps, never>>;
export default _default;
