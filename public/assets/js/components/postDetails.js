'use strict';

import dom from '../dom.js';
import settings from '../settings.js';
import btnClose from './buttonClose.js';
import btn from './button.js';
import languages from '../languages/all.js';
import ws from '../ws.js';
import timeline from '../views/timeline.js';

const postDetails = (post) => {
    let ln = languages[settings.lang];

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
    let imgDetail
    let imgsOverview = [];
    if (post.imgNames.length > 0) {
        let path = `/getImg/${settings.user._id}/${post.imgNames[currentIndex]}`;

        imgDetail = dom.create({
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

            let elImg = dom.create({
                type: 'img',
                parent,
                cssClassName: `${index == currentIndex ? 'current' : ''}`,
                attr: {
                    src: path
                },
                listeners: {
                    click() {
                        imgsOverview.forEach(img => {
                            img.classList.remove('active')
                        })
                        imgDetail.src = path;
                        elImg.classList.add('active');
                    }
                }
            })

            imgsOverview.push(elImg);
        })

        imgsOverview[0].classList.add('active');
        
    }

    dom.create({
        parent: container,
        content: post.text,
    })

    // Interaktion
    // Post entfernen
    btn({
        legend: ln.removePost,
        parent: container,
        onClick() {
            if (confirm(ln.confirmRemovePost)) {
                ws.removePost(post).then(
                    () => {
                        bg.remove();
                        timeline.reset();
                    }
                ).catch(
                    console.warn
                )
            }
        }
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