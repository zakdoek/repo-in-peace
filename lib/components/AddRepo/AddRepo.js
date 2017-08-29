/* lib/components/AddRepo/AddRepo.js */

import styles from "./AddRepo.scss";

import classnames from "classnames";
import speakingurl from "speakingurl";
import React, { Component } from "react";
import PropTypes from "prop-types";


export default class AddRepo extends Component {
    /**
     * Render
     */
    static propTypes = {
        history: PropTypes.object.isRequired,
        addRepo: PropTypes.func.isRequired,
    }

    state = {
        repo: "",
        message: "",
    }

    handleSubmit(event) {
        event.preventDefault();

        const { history, addRepo } = this.props;
        const { repo } = this.state;

        if (!repo || !repo.length) {
            this.setState({
                message: "You must enter a valid github url",
            });
            return;
        }

        // Normalize the url
        const segments = repo.replace(/-|_| /g, "").split("/");

        if (segments.length !== 2) {
            this.setState({
                message: "You must enter a valid github url",
            });
            return;
        }

        const [owner, name] = segments;
        const url =
            `https://github.com/${speakingurl(owner)}/${speakingurl(name)}`;

        addRepo(url)
            .then(() => console.log("Added"))
            .catch(err => console.log("Error", err.graphQLErrors[0].message));
        history.push("/");
    }

    render() {
        const { repo, message } = this.state;

        return (
            <div className={styles.addRepo}>
                <div className="container">
                    <div className="row justify-content-center">
                        <div className="col-lg-6 col-md-8 col-sm-10">
                            <form onSubmit={this.handleSubmit.bind(this)}>
                                <div className="input-group">
                                    <span className="input-group-addon">https://github.com/</span>
                                    <input
                                        autoFocus
                                        onChange={e => this.setState({ repo: e.target.value })}
                                        type="text"
                                        className="form-control"
                                        placeholder="owner/repository"
                                        value={repo}
                                    />
                                    <span className="input-group-btn">
                                        <input
                                            className="btn btn-secondary"
                                            type="submit"
                                            value="Add!"
                                        />
                                    </span>
                                </div>
                            </form>
                        </div>
                    </div>
                    {message ? (
                        <div className={classnames(styles.message, "row justify-content-center")}>
                            <div className="col-lg-6 col-md-8 col-sm-10">
                                <div className="alert alert-danger">
                                    {message}
                                </div>
                            </div>
                        </div>
                    ) : null}
                </div>
            </div>
        );
    }
}
