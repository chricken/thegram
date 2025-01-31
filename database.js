'use strict';

import settings from './settings.js'
import nano from 'nano';

const cr = settings.credentials.db;
const dbConn = nano(`http://${cr.user}:${cr.pw}@${cr.url}`).db;

const database = {
    init() {
        return dbConn.list().then(
            // Datenbanken anlegen
            res => {
                return Promise.all(
                    settings.neededDBs
                        .filter(dbName => !res.includes(dbName))
                        .map(dbName => dbConn.create(dbName))
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
                    payload: res.docs[0]
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
        ).then(
            res => res.posts
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

    }
}

export default database;