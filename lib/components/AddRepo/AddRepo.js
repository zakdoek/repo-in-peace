/* lib/components/AddRepo/AddRepo.js */

import styles from "./AddRepo.scss";

import React, { Component } from "react";
// import PropTypes from "prop-types";


export default class AddRepo extends Component {
    /**
     * Render
     */
    render() {
        return (
            <div className={styles.addRepo}>
                <div className="container">
                    <div className="row justify-content-center">
                        <div className="col-lg-6 col-md-8 col-sm-10">
                            <div className="input-group">
                                <span className="input-group-addon">https://github.com/</span>
                                <input
                                    type="text"
                                    className="form-control"
                                    placeholder="owner/repository"
                                />
                                <span className="input-group-btn">
                                    <input
                                        className="btn btn-secondary"
                                        type="submit"
                                        value="Add!"
                                    />
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}
