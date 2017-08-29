/* lib/components/Repo/Repo.js */

import styles from "./Repo.scss";

import classnames from "classnames";
import React, { Component } from "react";
import PropTypes from "prop-types";


const UPVOTE = "UPVOTE";
const DOWNVOTE = "DOWNVOTE";


const VoteButton = ({ voteType, hasVoted, count, onVote, loggedIn }) => {
    const content = (
        <span>
            {count} <i className={classnames(
                "fa fa-2x",
                voteType === UPVOTE ? "fa-thumbs-up" : "fa-thumbs-down",
            )}></i>
        </span>
    );

    if (hasVoted || !loggedIn) {
        return (
            <span className={classnames(styles.disabledButton, "btn btn-link")}>
                {content}
            </span>
        );
    }

    return (
        <button
            className={classnames(styles.enabledButton, "btn btn-link")}
            onClick={onVote}>
            {content}
        </button>
    );
};


export default class Repo extends Component {
    // Props
    static propTypes = {
        repo: PropTypes.object.isRequired,
        doVote: PropTypes.func.isRequired,
        loggedIn: PropTypes.bool.isRequired,
    }

    /**
     * Render
     */
    render() {
        const { doVote, repo, loggedIn } = this.props;
        const {
            name,
            url,
            owner: {
                username,
            },
            upvotesCount,
            downvotesCount,
            hasVoted,
        } = repo;

        return (
            <div className={classnames(styles.repo, "card")}>
                <div className="card-body">
                    <h4 className="card-title">{name}</h4>
                    <p className="card-text">
                        Added by { username }
                    </p>
                    <div className={styles.votes}>
                        <div className="row">
                            <div className="col-6">
                                <VoteButton
                                    loggedIn={loggedIn}
                                    voteType={UPVOTE}
                                    hasVoted={hasVoted}
                                    count={upvotesCount}
                                    onVote={() => doVote(repo, UPVOTE)}
                                />
                            </div>
                            <div className="col-6">
                                <VoteButton
                                    loggedIn={loggedIn}
                                    voteType={DOWNVOTE}
                                    hasVoted={hasVoted}
                                    count={downvotesCount}
                                    onVote={() => doVote(repo, DOWNVOTE)}
                                />
                            </div>
                        </div>
                    </div>
                    <a href={url} className="btn btn-primary" target="_blank">
                        Visit repo
                    </a>
                </div>
            </div>
        );
    }
}
