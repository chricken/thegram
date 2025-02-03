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
        // console.log(msg);

        if (msg.type == 'uploadMedia') {
            media.handleUploaded(msg.payload)
                .then(
                    res => {
                        res.status = 'done';
                        socket.send(JSON.stringify({
                            type: 'uploadStatus',
                            payload: res
                        }))
                    }
                ).catch(
                    err => {
                        socket.send(JSON.stringify({
                            type: 'uploadStatus',
                            payload: {
                                status: 'err',
                                err
                            }
                        }))
                    }
                )
        } if (msg.type == 'login') {
            database.checkLogin(msg.payload).then(
                res => {
                    socket.send(JSON.stringify({
                        type: 'loginStatus',
                        payload: res
                    }))
                }
            )
        } if (msg.type == 'getTimeline') {
            database.getMedia(msg.payload.mediaToLoad).then(
                res => {
                    socket.send(JSON.stringify({
                        type: 'getTimeline',
                        payload: res
                    }))
                }
            )
        } if (msg.type == 'getSubbedUsers') {
            database.getSubbedUsers(msg.payload.userID).then(
                res => {
                    socket.send(JSON.stringify({
                        type: 'getSubbedUsers',
                        payload: res
                    }))
                }
            )
        } if (msg.type == 'getNewUsers') {
            database.getNewUsers(msg.payload).then(
                res => {
                    socket.send(JSON.stringify({
                        type: 'getNewUsers',
                        payload: res
                    }))
                }
            )
        } if (msg.type == 'saveCurrentUser') {
            // Nachricht enthält den Namen, der als Antwort zurück gesendet werden soll
            // als "callbackType" 
            // So kann im Client auf die Antwort direkt reagiert werden
            database.saveUser(msg.payload).then(
                res => {
                    socket.send(JSON.stringify({
                        type: msg.callbackType,
                        payload: {
                            status: 'done',
                            result: res
                        }
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
