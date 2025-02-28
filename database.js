'use strict';

import settings, { agents } from './settings.js'
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

        return dbUsers.find({
            selector: {
                username: username
            }
        }).then(
            res => {

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
                    // Objekt neu anlegen, um sicherzugehen, dass alle Attribute drinnen sind
                    // und überzählige entfernt werden
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

    getMedia(mediaToLoad) {
        /*
        let dbPosts = dbConn.use(settings.dbNames.posts);
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
        */
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

        return dbUsers.get(userID).then(
            res => res.subbedUsers
        ).then(
            res => {
                return dbUsers.list().then(
                    users => users.rows
                        .map(row => row.id)
                        .filter(row => !row.startsWith('_design'))
                ).then(
                    // Sicherstellen, dass die gewünschten IDs auch existieren
                    userIDs => {
                        return Promise.all(
                            res.filter(
                                subbed => userIDs.some(el => el == subbed.userID)
                            ).map(
                                user => dbUsers.get(user.userID)
                            )
                        )
                    }
                )
            }
        ).then(
            res => {
                return res.map(user => {
                    delete user.password;
                    return user;
                })
            }
        ).then(
            res => res.toSorted((a, b) => b.chDate - a.chDate)
        )
    },

    getAllUsers() {
        let dbUsers = dbConn.use(settings.dbNames.users);
        return dbUsers.list().then(
            res => res.rows.map(row => row.id)
        ).then(
            res => res.filter(el => !el.startsWith('_design/'))
        )
    },

    getNewUsers() {
        let dbUsers = dbConn.use(settings.dbNames.users);

        return dbUsers.view(
            'dd_sort', 'byCrDate',
            {
                descending: true,
                limit: settings.numNewUsersToShow
            }
        ).then(
            res => res.rows.map(row => row.value)
        )
    },

    saveUserObject(user) {
        let dbUsers = dbConn.use(settings.dbNames.users);
        return dbUsers.insert(user);
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

        return dbUsers.get(id).then(
            res => res
        ).catch(
            () => null
        );
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
        let dbTokens = dbConn.use(settings.dbNames.authtokens);

        // Token in DB eintragen und das Token bei Erledigung zurück geben
        return dbTokens.insert(token).then(
            res => dbTokens.get(res.id)
        )
    },

    getToken(token) {
        let dbTokens = dbConn.use(settings.dbNames.authtokens);

        return dbTokens.get(token._id).then(
            res => {
                if (res.body.crDate < (Date.now() - settings.tokenValidity))
                    throw 'Token too old';
                else if (res.body.token != token.body.token)
                    throw 'Token invalid';
                else
                    return token.userID
            }
        )
    },

    addCommentToPost(comment) {
        let dbPosts = dbConn.use(settings.dbNames.posts);

        return dbPosts.get(comment.postID).then(
            post => {
                post.comments.push(comment._id);
                return post;
            }
        ).then(
            post => dbPosts.insert(post)
        )
    },

    addCommentToComment(comment) {
        let dbComments = dbConn.use(settings.dbNames.comments);
        console.log('anzuhängender Kommentar: ', comment);

        return dbComments.get(comment.commentID).then(
            post => {
                post.comments.push(comment._id);
                return post;
            }
        ).then(
            post => dbComments.insert(post)
        )
    },

    getComment(commentID) {
        let dbComments = dbConn.use(settings.dbNames.comments);
        return dbComments.get(commentID).then(
            res => {
                // console.log(res);
                return res;
            }
        )
    },

    getPost(postID){
        let dbPosts = dbConn.use(settings.dbNames.posts);
        return dbPosts.get(postID).then(
            res => {
                // console.log('DB Get Post', res);
                return res;
            }
        )
    },

    saveComment(comment) {
        let dbComments = dbConn.use(settings.dbNames.comments);
        
        return dbComments.insert(comment);

    },
}

export default database;