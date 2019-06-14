import * as React from "react";
import Helmet from "react-helmet";
import { BaseProps } from "../types";

const Contact: React.FC<BaseProps> = () => (
    <div>
        <h2>This is the contact page</h2>
        <Helmet>
            <title>Contact Page</title>
            <meta name="description" content="This is a proof of concept for React SSR" />
        </Helmet>
    </div>
);

export default Contact;
