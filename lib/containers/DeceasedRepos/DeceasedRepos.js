/* lib/containers/DeceasedRepos/DeceasedRepos.js */

import { graphql, gql, compose } from "react-apollo";

import DeceasedRepos from "../../components/DeceasedRepos/DeceasedRepos.js";


const DECEASED_REPOS = gql`
query DeceasedRepos($cursor: String) {
    repos(first: 2, after: $cursor) {
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


/**
 * Deceased repos HOC
 */
const queryRepos = graphql(DECEASED_REPOS, {
    props: ({
        data: {
            loading,
            fetchMore,
            repos,
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
            loadMore: () => {
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
