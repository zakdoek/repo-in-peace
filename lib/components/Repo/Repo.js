/* lib/components/Repo/Repo.js */

import styles from "./Repo.scss";

import classnames from "classnames";
import React, { Component } from "react";
import PropTypes from "prop-types";


const UPVOTE = "upvote";
const DOWNVOTE = "downvote";


const VoteButton = ({ voteType, hasVoted, count, onVote }) => {
    const content = (
        <span>
            {count} <i className={classnames(
                "fa",
                voteType === UPVOTE ? "fa-thumbs-up" : "fa-thumbs-down",
            )}></i>
        </span>
    );

    if (hasVoted) {
        return (
            <span className="btn btn-link">
                {content}
            </span>
        );
    }

    return (
        <button className="btn btn-link" onClick={onVote}>
            {content}
        </button>
    );
};


export default class Repo extends Component {
    // Props
    static propTypes = {
        repo: PropTypes.object.isRequired,
    }

    /**
     * Render
     */
    render() {
        const {
            name,
            url,
            owner: {
                username,
            },
            upvotesCount,
            downvotesCount,
            hasVoted,
        } = this.props.repo;

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
                                    voteType={UPVOTE}
                                    hasVoted={hasVoted}
                                    count={upvotesCount}
                                    onVote={() => console.log(UPVOTE)}
                                />
                            </div>
                            <div className="col-6">
                                <VoteButton
                                    voteType={DOWNVOTE}
                                    hasVoted={hasVoted}
                                    count={downvotesCount}
                                    onVote={() => console.log(DOWNVOTE)}
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
