'use strict';

import dom from '../dom.js';
import settings from '../settings.js';
// import userDetails from './userDetails.js';

const postOverview = (parent, user, post) => {
    // console.log('post overview 8', post);

    const container = dom.create({
        cssClassName: 'overview postOverview',
        parent,
        listeners: {
            click() {
                // userDetails(post)
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

    if (post.timestamp) {
        dom.create({
            parent: container,
            content: new Date(post.timestamp).toLocaleString()
        })
    }
    
   
    if (post.imgNames.length) {
        post.imgNames.forEach((imgName, index) => {
            let imgPreview = dom.create({
                cssClassName: `img img_${index}`,
                parent: container,
                styles: {
                    backgroundImage: `url(/getImg/${user._id}/${imgName})`
                }
            })

            dom.create({
                type: 'img',
                listeners: {
                    error(evt) {
                        console.log(`Bild ${imgName} konnte nicht geladen werden.`);
                        imgPreview.style.backgroundImage = 'url(/assets/img/404.png)';
                    }
                },
                attr: {
                    src: `/getImg/${user._id}/${imgName}`
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