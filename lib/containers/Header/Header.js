/* lib/containers/Header/Header.js */

import { graphql, gql } from "react-apollo";

import Header from "../../components/Header/Header.js";


const CURRENT_USER = gql`
query CurrentUser {
    viewer {
        id
        username
    }
}
`;


export default graphql(CURRENT_USER, {
    skip: ({ loggedIn }) => !loggedIn,
    props: ({ data: { viewer }, error, loading }) => ({
        username: !error && viewer && viewer.username ?
            viewer.username : null,
        loading,
    }),
})(Header);
