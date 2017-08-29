/* lib/containers/DeceasedRepos/DeceasedRepos.js */

import { graphql, gql } from "react-apollo";

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


/**
 * Deceased repos HOC
 */
export default graphql(DECEASED_REPOS, {
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
})(DeceasedRepos);
