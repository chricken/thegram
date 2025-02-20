'use strict';

import dom from '../dom.js';
import settings from '../settings.js';
import postDetails from './postDetails.js';
import userBadge from './userBadge.js';

const postOverview = (parent, post) => {
    // console.log('post overview 8', post);

    let container = dom.create({
        cssClassName: 'overview transit postOverview',
        parent,
        listeners: {
            click() {
                postDetails(post)
            },
            scroll(evt) {
                evt.stopPropagation();
            }
        }
    })
    
    // User Badge
    if (post.userID != settings.user._id) {
        container = userBadge({
            parent: container,
            userID: post.userID
        })
    }

    if (post.title) {
        dom.create({
            type: 'h3',
            content: post.title,
            parent: container
        })
    }

    if (post.timestamp) {
        dom.create({
            parent: container,
            content: new Date(post.timestamp).toLocaleString()
        })
    }


    if (post.imgNames.length) {

        post.imgNames.forEach((imgName, index) => {
            // console.log('imgNames: ', `url(/getImg/${post.userID}/${imgName})`);
            let imgPreview = dom.create({
                cssClassName: `img img_${index}`,
                parent: container,
                styles: {
                    backgroundImage: `url(/getImg/${post.userID}/${imgName})`
                }
            })

            dom.create({
                type: 'img',
                listeners: {
                    error(evt) {
                        console.log(`Bild "/getImg/${post.userID}/${imgName}" konnte nicht geladen werden.`);
                        imgPreview.style.backgroundImage = 'url(/assets/img/404.png)';
                    }
                },
                attr: {
                    src: `/getImg/${post.userID}/${imgName}`
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