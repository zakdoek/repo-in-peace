/* server/api/models/User.js */

import { model, Schema, Model } from "mongoose";
import { sign } from "jsonwebtoken";


/**
 * The User schema
 */
const UserSchema = new Schema({
    _id: Schema.Types.ObjectId,
    name: String,
});


/**
 * The user model
 */
class User extends Model {
    /**
     * Generate a jwt token
     */
    get token() {
        // Define payload
        return sign({
            id: this.id,
            name: this.name,
        }, process.env.JWT_SECRET);
    }
}


export default model(User, UserSchema, "users");
