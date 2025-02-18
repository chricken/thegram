'use strict';

import { WebSocketServer } from "ws";
import settings, { agents } from './settings.js';
import helpers from './helpers.js';
import database from './database.js';
import media from './media.js';
import handleUsers from './handleUsers.js';
import authToken from "./authToken.js";
import Agent from './classes/Agent.js';
import User from './classes/User.js';

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
            agents[msg.payload.userID].init().then(
                agent => agent.addPost(msg.payload)
            ).then(
                user => {
                    socket.send(JSON.stringify({
                        type: msg.callbackType,
                        payload: user
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
                    return agent.init(userID);
                }
            ).then(
                agent => {
                    socket.send(JSON.stringify({
                        type: msg.callbackType,
                        payload: {
                            status: 'success',
                            user: agent.user
                        }
                    }))
                }
            ).catch(
                // Wenn Token nicht gefunden oder nicht mehr gültig
                err => {
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
            agents[msg.payload.userID].init().then(
                agent => agent.getTimeline()
            ).then(
                posts => {
                    socket.send(JSON.stringify({
                        type: msg.callbackType,
                        payload: posts
                    }))
                }
            ).catch(
                () => {
                    console.log('There is an error while loading timeline 404');
                }
            )


        } else if (msg.type == 'getPosts') {
            agents[msg.payload.userID].init().then(
                agent => {
                    return agent.getPosts(msg.payload.mediaToLoad)
                }
            ).then(
                posts => {
                    socket.send(JSON.stringify({
                        type: msg.callbackType,
                        payload: posts
                    }))
                }
            )

        } else if (msg.type == 'getSubbedUsers') {
            return agents[msg.payload.userID].init().then(
                agent => agent.getSubbedUsers()
            ).then(
                res => socket.send(JSON.stringify({
                    type: msg.callbackType,
                    payload: res
                }))
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
            // console.log('save current user', msg.payload);
            agents[msg.payload._id].init().then(
                agent => {
                    agent.user = new User(msg.payload);
                    return agent.saveUser()
                }
            ).then(
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
                    // console.log('websocket 119', res);

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
            // console.log(msg.payload);
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
