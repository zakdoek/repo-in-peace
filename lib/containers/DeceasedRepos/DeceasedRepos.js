/* lib/containers/DeceasedRepos/DeceasedRepos.js */

import { graphql, gql, compose } from "react-apollo";

import DeceasedRepos from "../../components/DeceasedRepos/DeceasedRepos.js";


export const DECEASED_REPOS = gql`
query DeceasedRepos($cursor: String) {
    repos(first: 6, after: $cursor) {
        nodes {
            id
            name
            url
            upvotesCount
            downvotesCount
            owner {
                id
                username
            }
            hasVoted
        }
        cursor
        hasNextPage
    }
}
`;


const VOTE_FOR_REPO = gql`
mutation Vote($value: VoteType!, $repoId: ID!) {
    vote(vote: { value: $value, repoId: $repoId }) {
        id
        value
        repo {
            id
            upvotesCount
            downvotesCount
            hasVoted
        }
    }
}
`;


const REPO_ADDED_SUBSCRIPTION = gql`
subscription onRepoAdded {
    repoAdded {
        id
        name
        url
        upvotesCount
        downvotesCount
        owner {
            id
            username
        }
        hasVoted
    }
}
`;


/**
 * Deceased repos HOC
 */
const queryRepos = graphql(DECEASED_REPOS, {
    props: ({
        data: {
            loading,
            fetchMore,
            repos,
            subscribeToMore,
        },
    }) => {
        if (loading) {
            return {
                loading,
                nodes: null,
                hasNextPage: false,
                loadMore: null,
            };
        }

        const { nodes, hasNextPage, cursor } = repos;

        return {
            loading,
            nodes,
            hasNextPage,

            /**
             * Load more entries
             */
            loadMore() {
                return fetchMore({
                    variables: {
                        cursor,
                    },
                    updateQuery: (previousResult, { fetchMoreResult }) => {
                        return {
                            ...previousResult,
                            repos: {
                                ...previousResult.repos,
                                hasNextPage: fetchMoreResult.repos.hasNextPage,
                                cursor: fetchMoreResult.repos.cursor,
                                nodes: [
                                    ...previousResult.repos.nodes,
                                    ...fetchMoreResult.repos.nodes,
                                ],
                            },
                        };
                    },
                });
            },

            /**
             * Subscribe to new repos
             */
            repoAdded() {
                return subscribeToMore({
                    document: REPO_ADDED_SUBSCRIPTION,

                    /**
                     * Update query on push
                     */
                    updateQuery(prev, { subscriptionData }) {

                        if (!subscriptionData.data) {
                            return prev;
                        }
                        const newRepo = subscriptionData.data.repoAdded;

                        if (prev.repos.nodes.find(
                            repo => repo.id === newRepo.id)) {
                            return prev;
                        }

                        return Object.assign({}, prev, {
                            repos: {
                                ...prev.repos,
                                nodes: [
                                    newRepo,
                                    ...prev.repos.nodes,
                                ],
                            },
                        });
                    },
                });
            },
        };
    },
});


/**
 * Vote mutation
 */
const voteMutation = graphql(VOTE_FOR_REPO, {
    props({ mutate }) {
        return {
            doVote(repo, value) {
                let { upvotesCount, downvotesCount } = repo;

                if (value === "UPVOTE") {
                    upvotesCount++;
                } else {
                    downvotesCount++;
                }

                return mutate({
                    variables: {
                        repoId: repo.id,
                        value,
                    },
                    optimisticResponse: {
                        __typename: "Mutation",
                        vote: {
                            __typename: "Vote",
                            id: Math.round(Math.random() * -1000000),
                            value,
                            repo: {
                                __typename: "Repo",
                                id: repo.id,
                                upvotesCount,
                                downvotesCount,
                                hasVoted: true,
                            },
                        },
                    },
                    update(store, { data: { vote } }) {
                        const data = store.readQuery({
                            query: DECEASED_REPOS,
                            variables: {
                                cursor: null,
                            },
                        });

                        const storedRepoIdx = data.repos.nodes.findIndex(
                            r => r.id === vote.repo.id);

                        const storedRepo = data.repos.nodes[storedRepoIdx];



                        data.repos.nodes[storedRepoIdx].upvotesCount = vote.repo.upvotesCount;
                        storedRepo.downvotesCount = vote.repo.downvotesCount;
                        storedRepo.hasVoted = vote.repo.hasVoted;

                        data.repos.nodes[storedRepoIdx] = {
                            ...storedRepo,
                            ...vote.repo,
                        };

                        store.writeQuery({
                            query: DECEASED_REPOS,
                            variables: {
                                cursor: null,
                            },
                            data,
                        });
                    },
                });
            },
        };
    },
});

export default compose(
    queryRepos,
    voteMutation,
)(DeceasedRepos);
