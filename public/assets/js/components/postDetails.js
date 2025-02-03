'use strict';

import dom from '../dom.js';
import settings from '../settings.js';
import btnClose from './buttonClose.js';

const postDetails = (post) => {

    let currentIndex = 0;

    const bg = dom.create({
        parent: document.body,
        cssClassName: 'detailsBG'
    })

    const container = dom.create({
        parent: bg,
        cssClassName: 'details'
    })

    dom.create({
        parent: container,
        content: post.title,
        type: 'h3'
    })

    // Detailbild
    if (post.imgNames.length > 0) {
        let path = `/getImg/${settings.user._id}/${post.imgNames[currentIndex]}`;

        dom.create({
            type: 'img',
            cssClassName: 'imgDetail',
            parent: container,
            attr: {
                src: path
            }
        })
    }
    // Alle Bilder

    if (post.imgNames.length > 1) {
        const parent = dom.create({
            parent: container,
            cssClassName: 'allImgs'
        })

        post.imgNames.forEach((imgName, index) => {

            let path = `/getImg/${settings.user._id}/${imgName}`;

            dom.create({
                type: 'img',
                parent,
                cssClassName: `${index == currentIndex ? 'current' : ''}`,
                attr: {
                    src: path
                },
                listeners: {
                    click() {
                        imgDetail.src = path;
                    }
                }
            })
        })
    }

    dom.create({
        parent: container,
        content: post.text,
    })

    // Close-Button
    btnClose({
        parent: container,
        onClick() {
            bg.remove();
        }
    })
}

export default postDetails;