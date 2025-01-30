'use strict';

import dom from '../dom.js';
import settings from '../settings.js';
import postDetails from './postDetails.js';

const postOverview = (parent, post) => {
    const container = dom.create({
        cssClassName: 'postOverview',
        parent,
        listeners: {
            click() {
                postDetails(post)
            }
        }
    })

    if (post.title) {
        dom.create({
            type: 'h3',
            content: post.title,
            parent: container
        })
    }

    if (post.imgNames.length) {
        // console.log(`/getImg/${settings.user._id}/${post.imgNames[0]}`);
        post.imgNames.forEach((imgName, index) => {

            dom.create({
                cssClassName: `img img_${index}`,
                parent: container,
                styles: {
                    backgroundImage: `url(/getImg/${settings.user._id}/${imgName})`
                }
            })

        })
    }

    if (post.text) {
        dom.create({
            parent: container,
            content: post.text
        })
    }
}

export default postOverview