/* lib/redux/modules/reducer.js */
import { combineReducers } from "redux";

/**
 * The main reducer
 */
export default combineReducers({
    test: (state=null, action={}) => {
        console.log(action);
        return state;
    },
});
