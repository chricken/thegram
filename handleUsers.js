'use strict';

import database from './database.js';
import User from './classes/User.js';

const handleUsers = {
    register(credentials) {
        let user = new User(credentials);
        console.log('register', user);

        return database.addUser(user);
    }
}

export default handleUsers;