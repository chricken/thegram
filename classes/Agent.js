'use strict';

import database from '../database.js';
import settings from '../settings.js'
import nano from 'nano';
import User from './User.js';

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
    loadUser() {
        return this.dbUsers.get(this.userID)
    }
    saveUser() {

    }
    addPost(payload) {

    }
    removePost(payload) {

    }
    getPosts(mediaToLoad) {
        console.log('mediaToLoad', mediaToLoad);

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
        console.log('Agent getTimeline', this.user);

        return Promise.all(this.user.subbedUsers.map(subbed => {
            console.log('subbed user Agent', subbed);

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