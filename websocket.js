'use strict';

import { WebSocketServer } from "ws";
import settings, { agents, agentsPost } from './settings.js';
import helpers from './helpers.js';
import database from './database.js';
import handleUsers from './handleUsers.js';
import authToken from "./authToken.js";
import Agent from './classes/AgentUser.js';
import AgentPost from './classes/AgentPost.js';
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
            // console.log('Hochgeladene Daten', msg.payload);

            agents[msg.payload.userID].init().then(
                agent =>
                    agent.addPost(msg.payload)
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
                (err) => {
                    console.log(err);
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
            agents[msg.payload._id].init().then(

            ).then(
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
            handleUsers.register(msg.payload).then(
                res => {

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
                    socket.send(JSON.stringify({
                        type: msg.callbackType,
                        payload: {
                            status: 'err',
                            err
                        }
                    }))
                }
            );

        } else if (msg.type == 'getUser') {

            database.getUser(msg.payload.userID).then(
                res => {
                    socket.send(JSON.stringify({
                        type: msg.callbackType,
                        payload: {
                            user: res
                        }
                    }))
                }
            )

        } else if (msg.type == 'removePost') {

            agents[msg.payload.userID].init().then(
                agent => agent.removePost(msg.payload)
            ).then(
                agent => agent.saveUser()
            ).then(
                user => socket.send(JSON.stringify({
                    type: msg.callbackType,
                    payload: user
                }))
            )

        } else if (msg.type == 'getComment') {
            database.getComment(msg.payload.commentID).then(
                comment => {
                    socket.send(JSON.stringify({
                        type: msg.callbackType,
                        payload: {
                            comment
                        }
                    }))
                }
            ).catch(
                err => console.warn(err)
            )

        } else if (msg.type == 'saveComment') {
            console.log('Kommentar speichern', msg.payload);

            database.saveComment(msg.payload).then(
                // Kommentar im User ablegen
                res => {
                    msg.payload._id = res.id;
                    return agents[msg.payload.userID].init()
                }
            ).then(
                agent => agent.addComment(msg.payload)
            ).then(
                // Kommentar im Post / Kommentar ablegen
                user => {
                    if (msg.payload.postID) {
                        return database.addCommentToPost(msg.payload)
                    } else if (msg.payload.commentID) {
                        return database.addCommentToComment(msg.payload)
                    }
                }
            ).then(
                () => agents[msg.payload.userID].init()
            ).then(
                res => {
                    socket.send(JSON.stringify({
                        type: msg.callbackType,
                        payload: {
                            user: res.user
                        }
                    }))
                }
            ).catch(
                err => console.warn(err)
            )

        } else if (msg.type == 'getPost') {
            console.log('get Post', msg.payload);

            database.getPost(msg.payload.postID).then(
                res => socket.send(JSON.stringify({
                    type: msg.callbackType,
                    payload: res
                }))
            ).catch(
                err => console.warn(err)
            )

        } else if (msg.type == 'addLike') {
            console.log('Add Like: ', msg.payload);

            // Hier muss zunächst gecheckt werden, ob der Agent in der Sammlung exostiert, ggf angelegt werden und mit einem Timer wieder entfernt werden
            // Vielleicht mit einer Static Methode?

            AgentPost.getAgent(msg.payload.postID).then(
                agent => {
                    console.log('agent provided', !!agent);

                    return agent.addLike({
                        userID: msg.payload.userID
                    })
                }
            ).then(
                res => socket.send(JSON.stringify({
                    type: msg.callbackType,
                    payload: res
                }))
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
