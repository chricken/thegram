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
            'credentials',
            JSON.stringify(msg.payload)
        );
        app.handleLogin();

    } else {
        console.log('Nicht erfolgreich');
    }
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

                } else if (msg.type == 'loginStatus') {
                    // Zweimal payload, weil das Objekt auf dem Server zweimal verpackt wird
                    settings.user = msg.payload.payload;
                    settings.user.posts = settings.user.posts.toSorted((a, b) => b.crDate - a.crDate);
                    handleLogin(msg.payload)

                } else if (msg.type == 'uploadStatus') {
                    settings.user.posts = msg.payload.posts.toSorted((a, b) => b.crDate - a.crDate);
                    timeline.reset();

                } else if (msg.type == 'getTimeline') {
                    if (settings.firstLoad)
                        timeline.render(msg.payload);
                    else
                        timeline.append(msg.payload);
                } else if (msg.type == 'getSubbedUsers') {
                    findUsers.renderSubbedUsers(msg.payload)
                } else if (msg.type == 'getNewUsers') {
                    findUsers.renderNewUsers(msg.payload)
                } else if (msg.type == 'updateUserSave') {
                    settings.user = msg.payload.result;
                }
            })
            resolve();
        })
    },
    login({ username, password }) {
        console.log('login', username, password);

        socket.send(JSON.stringify({
            type: 'login',
            payload: {
                username, password
            }
        }))
    },
    uploadMedia(payload) {
        return new Promise(resolve => {
            socket.send(JSON.stringify({
                type: 'uploadMedia',
                payload
            }))
            resolve();
        })
    },
    getTimeline(mediaToLoad) {
        socket.send(JSON.stringify({
            type: 'getTimeline',
            payload: {
                userID: settings.user._id,
                mediaToLoad
            }
        }))
    },
    getSubbedUsers() {
        socket.send(JSON.stringify({
            type: 'getSubbedUsers',
            payload: {
                userID: settings.user._id,
            }
        }))
    },
    getNewUsers(numUsers) {
        socket.send(JSON.stringify({
            type: 'getNewUsers',
            payload: {
                userID: settings.user._id,
                numUsers
            }
        }))
    },
    saveCurrentUser() {
        /*
        socket.send(JSON.stringify({
            type: 'saveCurrentUser',
            payload: settings.user
        }))
        */
        return new Promise((resolve, reject) => {

            // Versuch, einer Kommunikation mit Callback
            let callbackType = (Math.random() * 1e17).toString(36) + Date.now();

            const callback = evt => {
                let msg = JSON.parse(evt.data);

                if (msg.type == callbackType) {
                    // Eventlistener wieder entfernen
                    socket.removeEventListener('message', callback);
                    // console.log('Callback im websocket-Ablauf', msg.payload);
                    settings.user = msg.payload.result;
                    resolve()
                }
            }

            socket.addEventListener('message', callback)

            socket.send(JSON.stringify({
                type: 'saveCurrentUser',
                payload: settings.user,
                callbackType,
            }))

        })
    }

}

export default ws;