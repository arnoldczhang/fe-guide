import * as React from "react";
import { Switch, Route } from "react-router-dom";
import Header from "./Header";
import routes from "../routes";

export type AppState = Partial<{
    title: string;
}>;

export type AppProps = Partial<{
    children?: React.ReactNode;
    dispatch?: Function | any;
}>;

class Layout extends React.Component<AppProps, AppState> {
    constructor(props = {}) {
        super(props);
        this.state = {
            title: "Welcome to React SSR!",
        };
    }

    render() {
        return (
            <div>
                <h1>{ this.state.title }</h1>
                <Header />
                <Switch>
                    { routes.map( route => <Route key={ route.path } { ...route } /> ) }
                </Switch>
            </div>
        );
    }
}

export default Layout;
