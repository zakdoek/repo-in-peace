/* lib/components/Header/Header.js */

import React, { Component } from "react";


export default class Header extends Component {

    /**
     * Render
     */
    render(){
        return (
            <div className="container text-right">
                <a href="/login">Login</a>
                <a href="/logout">Logout</a>
            </div>
        );
    }
}
