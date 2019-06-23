import * as React from "react";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import { CO } from '../types';

interface HelloProps {
    loggedIn: boolean;
}

const Header: React.FC<HelloProps> = ({
    loggedIn,
}) => (
    <div>
        <Link to="/">Home</Link>
        <Link to="/about">About</Link>
        <Link to="/contact">Contact</Link>
        { loggedIn && <Link to="/secret">Secret</Link> }
    </div>
);

const mapStateToProps = ( state: CO ) => ( {
    loggedIn: state.loggedIn,
} );

export default connect( mapStateToProps )( Header );
