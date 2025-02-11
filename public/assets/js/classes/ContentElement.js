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
        progress=0,     // Wert zwischen 0 und 1
    }) {
        Object.assign(this, {
            title, text, imgs, userID, type, tags,
            likes, dislikes, comments,forwardedPostID, progress
        })

    }
    get contentType() {
        return settings.contentTypes[this.type];
    }
}

export default ContentElement;