'use strict';

import settings from '../settings.js';

class ContentElement {
    constructor({
        title,
        text = '',
        imgs = [],
        userID = '',
        type = 0,
        tags = [],
        likes = [],
        dislikes = [],
        comments = [],
        forwardedPostID = '',
        progress = 0,     // Wert zwischen 0 und 1
        AIInfluence = {
            concept: 0,
            creation:0,
            documentation:0,
            postProcess:0
        }
    }) {
        Object.assign(this, {
            title, text, imgs, userID, type, tags,
            likes, dislikes, comments, forwardedPostID, progress, AIInfluence
        })

    }
    get contentType() {
        return settings.contentTypes[this.type];
    }
    set contentType(value){
        this.type = value;
    }
}

export default ContentElement;