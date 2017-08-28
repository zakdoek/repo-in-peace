/* lib/components/DeceasedRepos/DeceasedRepos.js */

import React, { Component } from "react";
import PropTypes from "prop-types";


/**
 * Deceased repo list
 */
export default class DeceasedRepos extends Component {

    // Props
    static propTypes = {
        nodes: PropTypes.arrayOf(PropTypes.object.isRequired).isRequired,
        loadMore: PropTypes.func.isRequired,
        loading: PropTypes.bool,
    }

    /**
     * Render
     */
    render() {
        const { nodes, loading, loadMore } = this.props;

        if (loading) {
            return <div className="container">loading</div>;
        }

        return (
            <div className="container">
                {nodes.map(repo => <div key={repo.id}>{repo.name}</div>)}
                <a onClick={loadMore}>Load more</a>
            </div>
        );
    }
}
