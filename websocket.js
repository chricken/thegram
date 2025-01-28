'use strict';

import { WebSocketServer } from "ws";
import settings from './settings.js';
import helpers from './helpers.js';
import database from './database.js';
import media from './media.js';

const wsServer = new WebSocketServer({ port: 8080 });

// Eventlisteners
wsServer.on('listening', () => {
    console.log('Websocketserver ist bereit.');
})

wsServer.on('connection', socket => {

    let id = helpers.createID(settings.wsSockets);
    socket.id = id
    settings.wsSockets[id] = socket;

    socket.on('message', msg => {
        msg = JSON.parse(msg.toString());
        console.log(msg);

        if (msg.type == 'uploadMedia') {
            media.handleUploaded(msg.payload);
        } if (msg.type == 'login') {
            database.checkLogin(msg.payload).then(
                res => {
                    socket.send(JSON.stringify({
                        type: 'loginStatus',
                        payload: res
                    }))
                }
            )
        }
    })

    socket.send(JSON.stringify({
        type: 'updateSocketID',
        payload: {
            socketID: id
        }
    }))

})

const websocket = {

}

export default websocket;
