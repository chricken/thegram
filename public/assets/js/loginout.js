'use strict';

import ws from './ws.js';

const loginout = {
    login(credentials) {
        ws.login(credentials);
    },
    logout() {
        localStorage.removeItem('credentials');
        location.reload();
    }
}

export default loginout