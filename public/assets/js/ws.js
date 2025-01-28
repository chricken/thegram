'use strict';

import settings from './settings.js';
import app from './views/app.js';

const socket = new WebSocket(settings.wsAddress);

// functions 
const handleLogin = msg => {
    if (msg.status == 'success') {
        settings.user = msg.payload;
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
        handleLogin(msg.payload)        
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
    }
}

export default ws;