'use strict';

import settings from './settings.js';
import timeline from './views/posts.js';

let socket;

// functions 
const handleLogin = msg => {
    if (msg.status == 'created') {
        // settings.user = msg.payload;


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
        })
    },

    checkToken(token) {
        // console.log(token);
        return createWSCall({
            type: 'checkToken',
            payload: token

        })
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
                console.log('uploadad ws', payload);

                settings.user = payload.user;
                settings.user.posts = settings.user.posts.toSorted((a, b) => b.crDate - a.crDate);
                timeline.reset();
                return 'Beitrag wurde gespeichert'
            }
        )
    },

    getPosts(mediaToLoad) {
        // Return to call
        return createWSCall({
            type: 'getPosts',
            payload: {
                userID: settings.user._id,
                mediaToLoad
            }
        })
    },

    getTimeline() {
        // Return to call
        console.log('get Timeline');

        return createWSCall({
            type: 'getTimeline',
            payload: {
                userID: settings.user._id,
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
                userID: settings.user._id
            }
        })
    },

    saveCurrentUser() {
        console.log('Save current User');

        return createWSCall({
            type: 'saveCurrentUser',
            payload: settings.user
        }).then(
            payload => {
                settings.user = payload.result;
                return settings.user;
            }
        )
    },

    removePost(postToRemove) {
        // Post aus der DB entfernen
        return createWSCall({
            type: 'removePost',
            payload: postToRemove
        }).then(
            result => {
                console.log('Post entfernt?', result);
                if (result.res.ok) {
                    settings.user.posts = settings.user.posts.filter(p => p.media != postToRemove._id)
                    return ws.saveCurrentUser()
                }
            }
        )

    },

    saveComment(comment) {
        return createWSCall({
            type: 'saveComment',
            payload: comment
        }).then(
            console.log
        ).catch(
            console.warn
        )

    },
}

export default ws;