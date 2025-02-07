'use strict';

import AuthToken from './classes/AuthToken.js';

const authToken = {
    create(user) {
        console.log('create Authtoken: ', user);
        let token = new AuthToken(user);
        return token;
    },
    tokenToJSON(token) {

    },
    JSONToToken(JSON) {

    }
}

export default authToken;