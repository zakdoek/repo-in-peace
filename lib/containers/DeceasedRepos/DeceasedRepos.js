/* lib/containers/DeceasedRepos/DeceasedRepos.js */

import { graphql, gql } from "react-apollo";

import DeceasedRepos from "../../components/DeceasedRepos/DeceasedRepos.js";


const DECEASED_REPOS = gql`
query DeceasedRepos($cursor: String) {
    repos(first: 10, after: $cursor) {
        edges {
            node {
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
        pageInfo {
            endCursor
            hasNextPage
        }
    }
}
`;


/**
 * Deceased repos HOC
 */
export default graphql(DECEASED_REPOS, {
    props: ({ data: { loading, repos, fetchMore, error } }) => {
        // TODO
        return {};
    },
})(DeceasedRepos);
