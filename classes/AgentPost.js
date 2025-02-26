'use strict';

import database from '../database.js';
import settings, { agentsPosts } from '../settings.js'
import nano from 'nano';
import media from '../media.js';
import Post from './Post.js';

const cr = settings.credentials.db;

class AgentPost {
    constructor({
        id = ''
    }) {
        this.postID = id;
        this.dbConn = nano(`http://${cr.user}:${cr.pw}@${cr.url}`).db;
        // this.dbUsers = this.dbConn.use(settings.dbNames.users);
        this.dbPosts = this.dbConn.use(settings.dbNames.posts);
        this.dbComments = this.dbConn.use(settings.dbNames.comments);
    }
    // Auch zum Aktualisieren der User-Daten aus der Datenbank
    init() {
        if (this.post) {
            return new Promise(resolve => resolve(this))
        } else {
            return this.loadPost().then(
                result => {
                    this.post = result;
                    return this;
                }
            )
        }
    }

    loadPost() {
        return this.dbPosts.get(this.postID)
    }

    update() {
    }

    addComment(payload) {
    }

    addLike({ userID }) {
        return new Promise((resolve) => {

            if (!this.post.likes.some(like => like.userID == userID)) {
                this.post.likes.push({
                    userID,
                    crDate: Date.now()
                })
                resolve({ status: 'success', payload: this.post })
            } else {
                resolve({ status: 'err', err: 'User already liked' })
            }

        })
    }

    static checkAgentExists(postID){
        return new Promise((resolve, reject) => {
            // Agenten suchen
            // Falls nicht vorhanden, Anlegen
            // Timer zum Entfernen des Agents starten
            
        })
    }
}

export default AgentPost;