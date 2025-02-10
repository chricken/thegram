'use strict';

import AuthToken from './classes/AuthToken.js';
import database from './database.js';

const authToken = {
    create(user) {
        return database.getUser(user._id).then(
            user => new AuthToken(user)
        ).then(
            token => database.saveToken(token)
        )
    },
    tokenToJSON(token) {

    },
    JSONToToken(JSON) {

    }
}

export default authToken;