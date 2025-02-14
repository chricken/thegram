'use strict';

import { WebSocketServer } from "ws";
import settings, { agents } from './settings.js';
import helpers from './helpers.js';
import database from './database.js';
import media from './media.js';
import handleUsers from './handleUsers.js';
import authToken from "./authToken.js";
import Agent from './classes/Agent.js';

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
                    // Daten erweitern
                    res.user.latestPost = res.media.mediaID;
                    res.user.chDate = Date.now();
                    res.status = 'done';
                    return res;
                }
            ).then(
                res => {
                    return database.saveUserObject(res.user).then(
                        () => {
                            return res
                        }
                    ).catch(
                        err => {
                            console.warn(err);
                            return res;
                        }
                    )
                }
            ).then(
                res => {
                    // Daten versenden
                    socket.send(JSON.stringify({
                        type: msg.callbackType,
                        payload: res
                    }))
                    return res.user
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
        } else if (msg.type == 'login') {

            database.checkLogin(msg.payload).then(
                res => {
                    if (res.status == 'success') {
                        // Token erzeugen und in DB hängen.
                        authToken.create(res.payload).then(
                            token => {
                                const agent = new Agent({
                                    id: res.payload._id
                                });
                                agents[res.payload._id] = agent;
                                console.log(Object.keys(agents));

                                return token;
                            }
                        ).then(
                            token => {

                                socket.send(JSON.stringify({
                                    type: msg.callbackType,
                                    payload: {
                                        status: 'created',
                                        user: res.payload,
                                        token
                                    }
                                }))
                            }
                        )
                    }
                }
            )
        } else if (msg.type == 'checkToken') {
            database.getToken(msg.payload).then(
                userID => {
                    const agent = new Agent({
                        id: userID
                    });
                    agents[userID] = agent;
                    console.log('agents on checkToken 118', Object.keys(agents));
                    return agent.init(userID);
                }
            ).then(
                user => {
                    socket.send(JSON.stringify({
                        type: msg.callbackType,
                        payload: {
                            status: 'success',
                            user
                        }
                    }))
                }
            ).catch(
                // Wenn Token nicht gefunden oder nicht mehr gültig
                err => {
                    console.log('err 135', err);
                    socket.send(JSON.stringify({
                        type: msg.callbackType,
                        payload: {
                            status: 'err',
                            err
                        }
                    }))
                }
            )

        } else if (msg.type == 'getTimeline') {
            const agent = agents[msg.payload.userID];
            agent.getTimeline().then(
                posts => {
                    socket.send(JSON.stringify({
                        type: msg.callbackType,
                        payload: posts
                    }))
                }
            ).catch(
                err => {
                    console.log(err)
                }
            )
        } else if (msg.type == 'getPosts') {
            // console.log('Load Posts', msg.payload);
            const agent = agents[msg.payload.userID];
            agent.getPosts(msg.payload.mediaToLoad).then(
                posts => {
                    // console.log('loaded Posts', posts);
                    socket.send(JSON.stringify({
                        type: msg.callbackType,
                        payload: posts
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
                            status: 'success',
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
        } else if (msg.type == 'saveComment') {
            console.log(msg.payload);
            database.saveComment(msg.payload).then(
                res => {
                    socket.send(JSON.stringify({
                        type: msg.callbackType,
                        payload: {
                            status: 'done',

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
