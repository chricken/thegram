'use strict';

import settings from './settings.js'
import nano from 'nano';
import User from './classes/User.js';
import media from './media.js';


const cr = settings.credentials.db;
const dbConn = nano(`http://${cr.user}:${cr.pw}@${cr.url}`).db;

const database = {
    init() {
        return dbConn.list().then(
            // Datenbanken anlegen
            res => {
                return Promise.all(
                    Object.values(settings.dbNames)
                        .filter(dbName => !res.includes(dbName))
                        .map(dbName => dbConn.create(dbName))
                    // settings.neededDBs
                )
            }
        ).then(
            res => console.log('All Databases are up and running')
        )
    },

    checkLogin({ username, password }) {
        let dbUsers = dbConn.use(settings.dbNames.users);
        // console.log('database', username, password);

        return dbUsers.find({
            selector: {
                username: username
            }
        }).then(
            res => {
                // console.log('35', res);

                if (res.docs.length == 0) return ({
                    status: 'err',
                    err: 'User not found'
                });
                if (res.docs[0].password != password) return ({
                    status: 'err',
                    err: 'Wrong password'
                });
                return {
                    status: 'success',
                    payload: new User(res.docs[0])
                };
            }
        ).catch(
            console.warn
        )
    },

    addMedia(payload) {
        let dbPosts = dbConn.use(settings.dbNames.posts);
        return dbPosts.insert(payload)
    },

    addMediaToUser(userID, mediaID) {
        let dbUsers = dbConn.use(settings.dbNames.users);

        return dbUsers.get(userID).then(
            // Aus den Daten eine neues Objekt erzeugen, um sicherzugehen, dass alle Attribute dabei sind. Auch neu erfundene
            payload => new User(payload)
        ).then(
            payload => {
                // console.log('addMediaToUser', payload);
                payload.posts.push({
                    media: mediaID,
                    crDate: Date.now(),
                    crDateClear: new Date().toLocaleTimeString(),
                });
                return payload;
            }
        ).then(
            payload => dbUsers.insert(payload)
        ).then(
            () => dbUsers.get(userID)
        )
    },

    getMedia(mediaToLoad) {
        let dbPosts = dbConn.use(settings.dbNames.posts);
        // console.log('getMedia', mediaToLoad);
        if (mediaToLoad.length) {
            return dbPosts.fetch({
                keys: mediaToLoad
            }).then(
                res => res.rows.map(row => row.doc)
            )
        } else {
            return new Promise(resolve => {
                resolve([])
            })
        }
    },

    getTimeline(userID, offset) {
        let dbUsers = dbConn.use(settings.dbNames.users);
        let dbPosts = dbConn.use(settings.dbNames.posts);

        return dbUsers.get(userID).then(
            res => {
                if (res.posts.length) {
                    return dbPosts.fetch({
                        keys: res.posts.map(post => post.media)
                    })
                } else {
                    return { rows: [] }
                }
            }
        ).then(
            res => res.rows.map(row => row.doc)
        )

    },

    getSubbedUsers(userID) {
        let dbUsers = dbConn.use(settings.dbNames.users);

        // console.log('subbed Users', userID);

        return dbUsers.get(userID).then(
            res => res.subbedUsers
        ).then(
            res => {
                // console.log(res);

                return Promise.all(
                    res.map(user =>
                        dbUsers.get(user.userID)
                    )
                )
            }
        ).then(
            res => res.map(user => {
                delete user.password;
                return user;
            })
        ).then(
            res => res.toSorted((a, b) => b.chDate - a.chDate)
        )
    },

    getNewUsers(payload) {
        let dbUsers = dbConn.use(settings.dbNames.users);

        return dbUsers.view(
            'dd_sort', 'byCrDate',
            {
                descending: true,
                limit: payload.numUsers
            }
        ).then(
            res => res.rows.map(row => row.value)
        )
    },

    saveUser(payload) {
        let dbUsers = dbConn.use(settings.dbNames.users);

        return new Promise((resolve, reject) => {
            if (typeof payload.imgAvatar == 'string') {
                resolve()
            } else {
                resolve(
                    media.handleUploadedImage(
                        settings.uploadPathAvatars,
                        payload._id,
                        payload.imgAvatar,
                    )
                )
            }
        }).then(
            res => {
                if (res) payload.imgAvatar = res
            }
        ).then(
            () => {
                return dbUsers.insert(payload)
            }
        ).then(
            res => dbUsers.get(res.id)
        )

    },

    addUser(payload) {
        if (!payload._id) {
            let dbUsers = dbConn.use(settings.dbNames.users);
            return dbUsers.find({
                selector: {
                    username: payload.username
                }
            }).then(
                res => res.docs
            ).then(
                res => {
                    if (res.length) throw ('Username already exists')
                    return dbUsers.insert(new User(payload));
                }
            ).then(
                res => {
                    return dbUsers.get(res.id)
                }
            )
        } else {
            // wenn eine ID vorliegt, dann gibt es den Benutzer schon
            return new Promise((resolve, reject) => reject('ID already inserted'))
        }
    },

    getUser(id) {
        let dbUsers = dbConn.use(settings.dbNames.users);

        return dbUsers.get(id);
    },

    removePost(payload) {
        let dbPosts = dbConn.use(settings.dbNames.posts);

        return dbPosts.destroy(payload._id, payload._rev).then(
            res => {
                return res;
            }
        )
    },

    saveToken(token) {
        console.log('save Token', token);

        let dbTokens = dbConn.use(settings.dbNames.authtokens);

        return dbTokens.insert(token);
    },
}

export default database;