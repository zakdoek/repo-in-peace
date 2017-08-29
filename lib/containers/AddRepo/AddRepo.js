/* lib/containers/AddRepo/AddRepo.js */

import { graphql, gql } from "react-apollo";
import { withRouter } from "react-router-dom";

import AddRepo from "../../components/AddRepo/AddRepo.js";
import { DECEASED_REPOS } from "../DeceasedRepos/DeceasedRepos.js";


const ADD_REPO = gql`
mutation AddRepo($url: String!) {
    addRepo(url: $url) {
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


const addRepoMutation = graphql(ADD_REPO, {
    /**
     * Return props
     */
    props({ ownProps, mutate }) {
        return {

            /**
             * Add repo method
             */
            addRepo(url) {
                return mutate({
                    variables: { url },
                    optimisticResponse: {
                        __typename: "Mutation",
                        addRepo: {
                            __typename: "Repo",
                            id: Math.round(Math.random() * -1000000),
                            name: url.split("/").pop(),
                            url,
                            upvotesCount: 0,
                            downvotesCount: 0,
                            owner: {
                                __typename: "User",
                                ...ownProps.user,
                            },
                            hasVoted: false,
                        },
                    },
                    /**
                     * Update the local datastore
                     */
                    update(store, { data: { addRepo } }) {
                        const data = store.readQuery({
                            query: DECEASED_REPOS,
                            variables: { cursor: null },
                        });

                        data.repos.nodes.unshift(addRepo);

                        store.writeQuery({
                            query: DECEASED_REPOS,
                            variables: { cursor: null },
                            data,
                        });
                    },
                });
            }
        };
    }
});


// TODO: Change with functional component
export default addRepoMutation(withRouter(AddRepo));
