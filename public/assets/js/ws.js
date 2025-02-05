'use strict';

import settings from './settings.js';
import app from './views/app.js';
import timeline from './views/timeline.js';
import findUsers from './views/findUsers.js';

let socket;

// functions 
const handleLogin = msg => {
    if (msg.status == 'success') {
        // settings.user = msg.payload;
        localStorage.setItem(
            settings.nameItemCredential,
            JSON.stringify(msg.payload)
        );
        app.handleLogin();

    } else {
        console.log('Nicht erfolgreich');
    }
}

const createWSCall = ({
    type = '',
    payload = {}
} = {}) => {
    return new Promise((resolve, reject) => {
        // Versuch, einer Kommunikation mit Callback
        let callbackType = (Math.random() * 1e17).toString(36) + Date.now();

        const callback = evt => {
            let msg = JSON.parse(evt.data);

            if (msg.type == callbackType) {
                // Eventlistener wieder entfernen
                socket.removeEventListener('message', callback);
                // onResponse()
                resolve(msg.payload)
            }
        }

        socket.addEventListener('message', callback)

        socket.send(JSON.stringify({
            type,
            payload,
            callbackType,
        }))

    })
}


const ws = {
    init() {
        return new Promise((resolve, reject) => {
            socket = new WebSocket(settings.wsAddress);
            socket.addEventListener('open', () => {
                resolve()
            })
        })
    },
    appendEventListeners() {
        return new Promise(resolve => {
            socket.addEventListener('open', evt => {
                console.log('Websocket ist verbunden.');
            })

            socket.addEventListener('message', msg => {
                msg = JSON.parse(msg.data);

                if (msg.type == 'updateSocketID') {
                    settings.socketID = msg.payload.socketID;
                    socket.id = msg.payload.socketID;
                }
            })
            resolve();
        })
    },
    login({ username, password }) {
        return createWSCall({
            type: 'login',
            payload: {
                username, password
            }
        }).then(
            msg => {
                console.log(msg);
                if (msg.status == 'success') {
                    settings.user = msg.payload;
                    settings.user.posts = settings.user.posts.toSorted((a, b) => b.crDate - a.crDate);
                    handleLogin(msg);
                    return 'Login abgeschlossen';
                } else if (msg.status == 'err') {
                    return msg.err;
                }
            }
        )
    },
    register(credentials) {
        return createWSCall({
            type: 'register',
            payload: credentials
        })
    },
    uploadMedia(payload) {
        return createWSCall({
            type: 'uploadMedia',
            payload
        }).then(
            payload => {
                settings.user.posts = payload.posts.toSorted((a, b) => b.crDate - a.crDate);
                timeline.reset();
                return 'Beitrag wurde gespeichert'
            }
        )
    },
    getTimeline(mediaToLoad) {
        // Return to call
        return createWSCall({
            type: 'getTimeline',
            payload: {
                userID: settings.user._id,
                mediaToLoad
            }
        })
    },
    getSubbedUsers() {
        return createWSCall({
            type: 'getSubbedUsers',
            payload: {
                userID: settings.user._id,
            }
        })
    },
    getNewUsers(numUsers) {
        return createWSCall({
            type: 'getNewUsers',
            payload: {
                userID: settings.user._id,
                numUsers
            }
        })
    },
    saveCurrentUser() {
        createWSCall({
            type: 'saveCurrentUser',
            payload: settings.user
        }).then(
            payload => {
                settings.user = payload.result;
            }
        )
    }
}

export default ws;