'use strict';

import { WebSocketServer } from "ws";
import settings from './settings.js';
import helpers from './helpers.js';
import database from './database.js';
import media from './media.js';
import handleUsers from './handleUsers.js';
import authToken from "./authToken.js";

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

        if (msg.type == 'uploadMedia') {
            msg.payload.timestamp = Date.now();
            media.handleUploaded(settings.uploadPath, msg.payload).then(
                res => {
                    res.status = 'done';
                    socket.send(JSON.stringify({
                        type: msg.callbackType,
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
        } else if (msg.type == 'loginByToken') {

        } else if (msg.type == 'login') {
            // console.log(msg.payload);

            database.checkLogin(msg.payload).then(
                res => {
                    // console.log('Rückgabe vom Login', res);
                    if (res.status == 'success') {
                        let token = authToken.create(res.payload);
                        socket.send(JSON.stringify({
                            type: msg.callbackType,
                            payload: {
                                user: res.payload,
                                token
                            }
                        }))
                        return token;
                    } else {

                    }
                }
            ).then(
                database.saveToken
            )
        } else if (msg.type == 'getTimeline') {
            database.getMedia(msg.payload.mediaToLoad).then(
                res => {
                    socket.send(JSON.stringify({
                        type: msg.callbackType,
                        payload: res
                    }))
                }
            )
        } else if (msg.type == 'getSubbedUsers') {
            database.getSubbedUsers(msg.payload.userID).then(
                res => {
                    socket.send(JSON.stringify({
                        type: msg.callbackType,
                        payload: res
                    }))
                }
            )
        } else if (msg.type == 'getNewUsers') {
            database.getNewUsers(msg.payload).then(
                res => {
                    socket.send(JSON.stringify({
                        type: msg.callbackType,
                        payload: res
                    }))
                }
            )
        } else if (msg.type == 'saveCurrentUser') {
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
        } else if (msg.type == 'register') {
            // console.log(msg.payload);
            handleUsers.register(msg.payload).then(
                res => {
                    console.log('websocket 119', res);

                    socket.send(JSON.stringify({
                        type: msg.callbackType,
                        payload: {
                            status: 'done',
                            res
                        }
                    }))
                }
            ).catch(
                err => {
                    console.log('websocket 131', err);

                    socket.send(JSON.stringify({
                        type: msg.callbackType,
                        payload: {
                            status: 'err',
                            err
                        }
                    }))
                }
            );

        } else if (msg.type == 'removePost') {

            media.removeFiles(settings.uploadPath, msg.payload).then(
                () => database.removePost(msg.payload)
            ).then(
                () => database.getUser(msg.payload.userID)
            ).then(
                res => {
                    socket.send(JSON.stringify({
                        type: msg.callbackType,
                        payload: {
                            status: 'done',
                            res
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
