/* lib/redux/modules/reducer.js */
import { combineReducers } from "redux";


/**
 * The main reducer
 */
export default client => combineReducers({
    apollo: client.reducer(),
});
