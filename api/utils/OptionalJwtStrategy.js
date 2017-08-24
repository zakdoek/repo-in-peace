/* server/utils/OptionalJwtStrategy.js */

import { Strategy } from "passport-jwt";


/**
 * Wrap the authenticate method to support optional auth
 *
 * Will auth but leave user empty when no token can be found
 */
Strategy.prototype.authenticate = function(req) {

    const self = this;
    const token = self._jwtFromRequest(req);
    /**
     * Verified func
     */
    function verified(err, user, info) {
        if(err) {
            return self.error(err);
        } else {
            return self.success(user, info);
        }
    }

    // When no token is set
    if (!token) {
        // Pass anyway, but with a falsy payload
        try {
            if (this._passReqToCallback) {
                this._verify(req, null, verified);
            } else {
                this._verify(null, verified);
            }
        } catch(ex) {
            this.error(ex);
        }

        return;
    }

    // Token is set, try to decode the token
    this._secretOrKeyProvider(req, token, (secretOrKeyError, secretOrKey) => {

        // Error when secret or key could not be retrieved
        if (secretOrKeyError) {
            self.fail(secretOrKeyError);
            return;
        }

        // Verify the JWT
        Strategy.JwtVerifier(
            token,
            secretOrKey,
            self._verifOpts,
            (err, payload) => {
                // Verification failed
                if (err) {
                    payload = null;
                }

                // Pass to verify function
                try {
                    if (self._passReqToCallback) {
                        self._verify(req, payload, verified);
                    } else {
                        self._verify(payload, verified);
                    }
                } catch(ex) {
                    self.error(ex);
                }
            },
        );
    });
};


export default Strategy;
