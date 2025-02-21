'use strict';

import dom from '../dom.js';
import settings from '../settings.js';
import btnClose from './buttonClose.js';
import btn from './button.js';
import languages from '../languages/all.js';
import ws from '../ws.js';
import posts from '../views/posts.js';
import postComment from './postComment.js';

const postDetails = (post) => {
    let ln = languages[settings.lang];

    let currentIndex = 0;

    const bg = dom.create({
        parent: document.body,
        cssClassName: 'detailsBG'
    })

    const container = dom.create({
        parent: bg,
        cssClassName: 'details',
        listeners: {
            scroll(evt) {
                evt.stopPropagation();
            }
        },
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
        let path = `/getImg/${post.userID}/${post.imgNames[currentIndex]}`;

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

            let path = `/getImg/${post.userID}/${imgName}`;

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
    const containerUI = dom.create({
        parent: container,
        cssClassName: 'container',
    })

    if (post.userID == settings.user._id) {

        // Post entfernen
        btn({
            legend: ln.removePost,
            parent: containerUI,
            isEncapsuled: false,
            onClick() {
                if (confirm(ln.confirmRemovePost)) {
                    ws.removePost(post).then(
                        () => {
                            bg.remove();
                            posts.reset();
                        }
                    ).catch(
                        console.warn
                    )
                }
            }
        })

        btn({
            legend: ln.editPost,
            parent: containerUI,
            isEncapsuled: false,
            onClick() {

            }
        })
    } else {
        btn({
            legend: ln.addComment,
            parent: containerUI,
            isEncapsuled: false,
            onClick() {
                postComment({
                    parent: container,
                    post
                })
            }
        })
    }

    // Close-Button
    btnClose({
        parent: container,
        onClick() {
            bg.remove();
        }
    })
}

export default postDetails;