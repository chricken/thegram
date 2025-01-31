'use strict';

import settings from './settings.js';
import app from './views/app.js';
import timeline from './views/timeline.js';

const socket = new WebSocket(settings.wsAddress);

// functions 
const handleLogin = msg => {
    if (msg.status == 'success') {
        // settings.user = msg.payload;
        localStorage.setItem(
            'credentials',
            JSON.stringify(msg.payload)
        );
        app.handleLogin()

    } else {
        console.log('Nicht erfolgreich');
    }
}

socket.addEventListener('open', evt => {
    console.log('Websocket ist verbunden.');
})

socket.addEventListener('message', msg => {
    msg = JSON.parse(msg.data);

    if (msg.type == 'updateSocketID') {
        settings.socketID = msg.payload.socketID;
        socket.id = msg.payload.socketID;
        // console.log(settings);
    } else if (msg.type == 'loginStatus') {
        // console.log('loginStatus', msg.payload);
        // Zweimal payload, weil das Objekt auf dem Server zweimal verpackt wird
        settings.user = msg.payload.payload;
        settings.user.posts = settings.user.posts.toSorted((a, b) => b.crDate - a.crDate);
        // console.log('posts loaded on login', settings.user.posts);

        handleLogin(msg.payload)
    } else if (msg.type == 'uploadStatus') {
        // console.log('uploadStatus', msg.payload);
        // console.log(msg.payload);
        // ws.getTimeline()
        let posts = msg.payload.posts.toSorted((a, b) => b.crDate - a.crDate);
        // console.log('posts loaded', posts);

        settings.user.posts = posts;

        // settings.posts = [];
        settings.firstLoad = true;
        settings.offset = 0;

        timeline.init();
    } else if (msg.type == 'getTimeline') {
        // console.log('getTimeline');
        // console.log(msg.payload);
        if (settings.firstLoad)
            timeline.render(msg.payload);
        else
            timeline.append(msg.payload);
    }

})

const ws = {
    login(username, password) {
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
    }
}

export default ws;