/* lib/components/DeceasedRepos/DeceasedRepos.js */

import styles from "./DeceasedRepos.scss";

import React, { Component } from "react";
import PropTypes from "prop-types";

import Repo from "../Repo/Repo.js";


/**
 * Deceased repo list
 */
export default class DeceasedRepos extends Component {

    // Props
    static propTypes = {
        loggedIn: PropTypes.bool.isRequired,
        doVote: PropTypes.func.isRequired,
        nodes: PropTypes.arrayOf(PropTypes.object.isRequired),
        hasNextPage: PropTypes.bool,
        loadMore: PropTypes.func,
        loading: PropTypes.bool,
        repoAdded: PropTypes.func,
    }

    /**
     * Before component mount
     */
    componentDidMount() {
        if (this.props.repoAdded) {
            this.props.repoAdded();
        }
    }

    /**
     * Render
     */
    render() {
        const {
            nodes,
            loading,
            loadMore,
            hasNextPage,
            doVote,
            loggedIn,
        } = this.props;

        if (!nodes && loading) {
            return <div className="container">loading</div>;
        }

        return (
            <div className={styles.list}>
                <div className="container">
                    <div className="row">
                        {nodes.map(repo => (
                            <div key={repo.id} className="col-lg-4 col-md-6">
                                <Repo
                                    repo={repo}
                                    doVote={doVote}
                                    loggedIn={loggedIn}
                                />
                            </div>
                        ))}
                    </div>
                    {hasNextPage && loadMore ? (
                        <div className="text-center">
                            <button className="btn btn-link" onClick={loadMore}>
                                &lt;&lt; load more &gt;&gt;
                            </button>
                        </div>
                    ) : null}
                </div>
            </div>
        );
    }
}
