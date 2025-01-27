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

    checkLogin({ userName, password }) {
        let dbUsers = dbConn.use(settings.dbNames.users);
        // console.log('database', userName, password);

        return dbUsers.find({
            selector: {
                username: userName
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

    addMediaToUser(media, payload) {
        let dbUsers = dbConn.use(settings.dbNames.users);
        let id = payload.userID;
        dbUsers.get(id).then(
            payload => {
                console.log(payload);
                payload.posts.push(media._id);
                return payload;
            }
        ).then(
            payload => {
                dbUsers.insert(payload);
            }
        )
    }
}

export default database;