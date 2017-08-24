/* server/api/models/User.js */

import mongoose, { Schema, Model } from "mongoose";
import { sign } from "jsonwebtoken";
import slugify from "speakingurl";


/**
 * The User schema
 */
const UserSchema = new Schema({
    _id: { type: Schema.Types.ObjectId, auto: true },
    name: String,
    username: String,
}, { timestamps: true });


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
            username: this.username,
        }, process.env.API_JWT_SECRET);
    }

    /**
     * Save instance
     */
    save(...args) {
        // Ensure username from name
        if (!this.username) {
            this.username = slugify(this.name, "");
        }
        return super.save(...args);
    }
}


export default mongoose.model(User, UserSchema, "users");
