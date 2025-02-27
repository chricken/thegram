'use strict';

import database from '../database.js';
import settings, { agentsPost } from '../settings.js'
import nano from 'nano';
import media from '../media.js';
import Post from './Post.js';
import Like from './Like.js';

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

    savePost() {
        return this.dbPosts.insert(this.post).then(
            res => {
                this.post._rev = res.rev;
                return this.post;
            }
        )
    }

    addLike({ userID }) {
        return new Promise((resolve) => {
            console.log();
            let storedLikeIDs = this.post.likes.map(like => like.userID);
            console.log('Stored Likes: ', userID, storedLikeIDs);
            
            if (!storedLikeIDs.includes(userID)) {
                this.post.likes.push(
                    new Like(userID)
                )
            }
            resolve();
        }).then(
            () => this.savePost()
        ).then(
            () => this.post
        )
    }

    static addAgent(postID) {

        return new Promise((resolve, reject) => {
            const agentPost = new AgentPost({
                id: postID
            })
            agentsPost[postID] = agentPost;
            console.log('addAgend', Object.keys(agentsPost));
            
            resolve(agentPost.init());
        })
    }

    static getAgent(postID) {

        return new Promise((resolve, reject) => {
            // Agenten suchen
            // Falls nicht vorhanden, Anlegen
            // Timer zum Entfernen des Agents starten
            console.log('getAgent', postID, !!agentsPost[postID]);
            
            if (agentsPost[postID]) {
                resolve(agentsPost[postID]);
            } else {
                resolve(AgentPost.addAgent(postID));
            }
        })
    }
}

export default AgentPost;