'use strict';

import settings from '../settings.js';
import dom from '../dom.js';
import ws from '../ws.js';

const likes = ({
    likes = [],
    parent = null,
    post = null,
    handleLiked = () => { }
}) => {
    let hasLikedAlready = likes.some(like => like.userID == settings.user._id);
    console.log('Ist schon geliked', hasLikedAlready);

    const container = dom.create({
        parent,
        cssClassName: 'container likes',
        content: `${likes.length} Like${(likes.length != 1) ? 's' : ''}`
    })

    if (hasLikedAlready) {

    } else {
        dom.create({
            parent: container,
            type: 'span',
            cssClassName: 'btnAdd',
            content: '+',
            listeners: {
                click() {
                    ws.addLike({
                        postID: post._id,
                    }).then(
                        handleLiked
                    )
                }
            }
        })
    }

    return container;

}

export default likes;