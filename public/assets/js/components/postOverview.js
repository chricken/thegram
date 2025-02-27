'use strict';

import dom from '../dom.js';
import settings from '../settings.js';
import postDetails from './postDetails.js';
import userBadge from './userBadge.js';

const postOverview = (parent, post) => {

    // console.log('post', post);

    let container = dom.create({
        cssClassName: 'overview transit postOverview',
        parent,
        listeners: {
            click() {
                postDetails.init(post)
            },
            scroll(evt) {
                evt.stopPropagation();
            }
        }
    })

    if (post.isDraft) {
        container.classList.add('isDraft')
        const markerDraft = dom.create({
            parent: container,
            cssClassName: 'markerDraft',
            content: 'Draft'
        })
    }

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
                    error() {
                        // console.log(`Bild "/getImg/${post.userID}/${imgName}" konnte nicht geladen werden.`);
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
        let text = post.text;
        if (text.length > settings.postPreviewMaxLength + 5)
            text = text.substring(0, settings.postPreviewMaxLength) + '...';

        dom.create({
            parent: container,
            content: text
        })
    }


}

export default postOverview