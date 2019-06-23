import * as React from "react";
import { Switch, Route } from "react-router-dom";
import Header from "./Header";
import routes from "../routes";
import {
    BaseState,
    BaseProps,
} from "../types";

class Layout extends React.Component<BaseProps, BaseState> {
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
