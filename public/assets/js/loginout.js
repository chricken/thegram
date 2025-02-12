'use strict';

import ws from './ws.js';
import settings from './settings.js';
import viewLogin from './views/maskLogin.js';
import app from './views/app.js';

const loginout = {
    login({ username = '', password = '' } = {}) {
        ws.login({ username, password }).then(
            msg => {
                console.log(msg);
                if (msg.status == 'created') {
                    // Userdate ablegen
                    settings.user = msg.user;
                    settings.user.posts = settings.user.posts.toSorted(
                        (a, b) => b.crDate - a.crDate
                    );

                    // Token ins localStorage schreiben
                    localStorage.setItem(
                        settings.nameItemAuthToken,
                        JSON.stringify(msg.token)
                    );
                    app.handleLogin();

                    return 'Login abgeschlossen';
                } else if (msg.status == 'err') {
                    return msg.err;
                }
            }
        )
    },
    autoLogin() {
        // Token aus LS holen 
        let token = localStorage.getItem(settings.nameItemAuthToken);
        if (token) {
            token = JSON.parse(token);
            ws.checkToken(token).then(
                res => {
                    if (res.status == 'success') {
                        settings.user = res.user;
                        settings.user.posts = settings.user.posts.toSorted(
                            (a, b) => b.crDate - a.crDate
                        );
                        app.handleLogin();
                    } else {
                        viewLogin();
                    }
                }
            )
        } else {
            viewLogin();
        }
    },
    logout() {
        localStorage.removeItem(settings.nameItemAuthToken);
        location.reload();
    },
    register(credentials) {
        return ws.register(credentials);
    }
}

export default loginout