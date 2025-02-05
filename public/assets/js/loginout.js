'use strict';

import ws from './ws.js';

const loginout = {
    login(credentials) {
        ws.login(credentials);
    },
    logout() {
        localStorage.removeItem('credentials');
        location.reload();
    },
    register(credentials) {
        return ws.register(credentials);
    }
}

export default loginout