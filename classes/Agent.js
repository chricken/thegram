'use strict';

import database from '../database.js';
import settings, { agents } from '../settings.js'
import nano from 'nano';
import media from '../media.js';
import Post from './Post.js';

const cr = settings.credentials.db;

class Agent {
    constructor({
        id = ''
    }) {
        this.userID = id;
        this.dbConn = nano(`http://${cr.user}:${cr.pw}@${cr.url}`).db;
        this.dbUsers = this.dbConn.use(settings.dbNames.users);
        this.dbPosts = this.dbConn.use(settings.dbNames.posts);
    }
    // Auch zum Aktualisieren der User-Daten aus der Datenbank
    init() {
        if (this.user) {
            return new Promise(resolve => resolve(this))
        } else {
            return this.loadUser().then(
                result => {
                    this.user = result;
                    return this;
                }
            )
        }
    }

    update() {
        return this.loadUser().then(
            result => {
                this.user = result;
                return this;
            }
        )
    }

    getSubbedUsers() {
        console.log('subbed Users', this.user.subbedUsers);

        return this.dbUsers.fetch({
            keys: this.user.subbedUsers.map(el => el.userID)
        }).then(
            res => res.rows.map(row => row.doc)
        )
    }

    loadUser() {
        return this.dbUsers.get(this.userID)
    }

    saveUser() {
        return new Promise((resolve, reject) => {
            if (typeof this.user.imgAvatar == 'string') {
                resolve()
            } else {
                media.handleUploadedImage(
                    settings.uploadPathAvatars,
                    this.user._id,
                    this.user.imgAvatar
                ).then(
                    filename => {
                        this.user.imgAvatar = filename;
                        this.user.previousImgsAvatar.push(filename);
                        resolve()
                    }
                )
            }

        }).then(
            () => this.dbUsers.insert(this.user).then(
                res => {
                    console.log('insert dbUser', res);
                    this.user._rev = res.rev;
                    return this.user;
                }
            )
        )
    }

    addPost(payload) {
        // console.log('Agent Add Post', payload);

        return media.handleUploaded(settings.uploadPath, payload).then(
            payload => {
                // Bilder entfernen
                delete payload.imgs;
                console.log('Daten sind hochgeladen', payload);

                // Zur Datenbank hinzufügen
                return database.addMedia(payload);
            }
        ).then(
            res => {
                console.log('Rückgabe addMedia', res);
                // Daten erweitern
                this.user.latestPost = res.id;
                this.user.chDate = Date.now();
                this.user.posts.push(new Post({ id: res.id }));
            }
        ).then(
            () => this.saveUser()
        ).then(
            () => {
                console.log('aktueller user', this.user._id);
                return this.user
            }
        )
    }

    removePost(post) {
        console.log('Method remove Post', post);

        return media.removeFiles(settings.uploadPath, post).then(
            () => {
                console.log('Lösche Dies', post._id, post._rev);
                return this.dbPosts.destroy(post._id, post._rev)
            }
        ).then(
            res => {
                console.log(res);

                this.user.posts = this.user.posts.filter(el => {
                    return el.media != post._id
                })
                return this;
            }
        )

    }

    getPosts(mediaToLoad) {
        // console.log('mediaToLoad', mediaToLoad);
        if (mediaToLoad.length) {
            return this.dbPosts.fetch({
                keys: mediaToLoad
            }).then(
                res => res.rows.map(row => row.doc)
            )
        } else {
            return new Promise(resolve => {
                resolve([])
            })
        }
    }

    getTimeline() {
        return Promise.all(this.user.subbedUsers.map(subbed => {
            return database.getUser(subbed.userID);
        })).then(
            users => {
                users = users.filter(user => user != null);
                users.sort((a, b) => b.chDate - a.chDate);
                return Promise.all(users.map(user =>
                    settings.agents[user._id].getLatestPost()
                ));
            }
        )
    }

    getLatestPost() {
        return this.dbPosts.get(this.user.latestPost);
    }
}

export default Agent;