'use strict';

import settings from '../settings.js';

class ContentElement {
    constructor({
        _id = null,
        _rev = null,
        title,
        text = '',
        imgs = [],
        imgNames = [],
        userID = '',
        type = 0,
        tags = [],
        likes = [],
        dislikes = [],
        comments = [],
        forwardedPostID = '',
        isDraft = false,
        timestamp='',
        progress = 0,     // Wert zwischen 0 und 1
        AIInfluence = {
            concept: 0,
            creation: 0,
            documentation: 0,
            postProcess: 0
        }
    }) {
        Object.assign(this, {
            title, text, imgs, imgNames, userID, type, tags,
            likes, dislikes, comments, isDraft,
            forwardedPostID, progress, AIInfluence, timestamp
        })
        if (_id) this._id = _id;
        if (_rev) this._rev = _rev;

    }
    get contentType() {
        return settings.contentTypes[this.type];
    }
    set contentType(value) {
        this.type = value;
    }
}

export default ContentElement;