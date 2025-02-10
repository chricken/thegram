'use strict';

import settings from '../public/assets/js/settings.js';

const status = {
    '1': 'active',
    '2': 'revoked',
    '3': 'expired'
}

class AuthToken {
    constructor(user) {
        let hash = [...JSON.stringify(user)];
        hash = hash.reduce((sum, char, index) => {
            return sum + char.charCodeAt(0);
        }, 0);

        console.log('validity', settings);

        this.userID = user._id;

        this.head = {
            typ: 'JWT',
        }

        this.body = {
            token: (Math.random() * 1e17).toString(36) + '_' + Date.now().toString(36) + '_' + hash.toString(36),
            crDate: Date.now(),
            // expDate: Date.now() + settings.tokenValidity,
            status: status[1],
        }
    }
}

export default AuthToken;