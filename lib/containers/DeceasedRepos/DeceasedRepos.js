/* lib/containers/DeceasedRepos/DeceasedRepos.js */

import { graphql, gql } from "react-apollo";

import DeceasedRepos from "../../components/DeceasedRepos/DeceasedRepos.js";


const DECEASED_REPOS = gql`
query DeceasedRepos($cursor: String) {
    repos(first: 1, after: $cursor) {
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
    }
}
`;


/**
 * Deceased repos HOC
 */
export default graphql(DECEASED_REPOS, {
    props: ({ data: { loading, fetchMore, repos: { cursor, nodes } } }) => {
        return {
            loading,
            nodes,
            loadMore: () => {
                return fetchMore({
                    variables: {
                        cursor,
                    },
                    updateQuery: (previousResult, { fetchMoreResult }) => {
                        return {
                            repos: {
                                cursor: fetchMoreResult.repos.cursor,
                                nodes: [
                                    ...previousResult.repos.nodes,
                                    ...fetchMoreResult.repos.nodes,
                                ],
                            }
                        };
                    },
                });
            },
        };
    },
})(DeceasedRepos);
