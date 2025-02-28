'use strict';

import dom from '../dom.js';
import settings from '../settings.js';
import btnClose from './buttonClose.js';
import btn from './button.js';
import languages from '../languages/all.js';
import ws from '../ws.js';
import posts from '../views/posts.js';
import postComment from './postComment.js';
import compComment from './comment.js';
import compLikes from './likes.js';
import addMedia from '../views/addMedia.js';

const postDetails = {
    init(post) {
        console.log('init', post);

        ws.getPost(post._id).then(
            postDetails.render
        )
    },
    render(post) {
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
                    // console.log(container.scrollTop);
                    // upperBar.style.transform = `translateY(${container.scrollTop}px)`
                }
            },
        })

        const upperBar = dom.create({
            parent: container,
            cssClassName: 'barTop',

        })

        dom.create({
            parent: upperBar,
            content: post.title,
            type: 'h3'
        })

        // Close-Button
        btnClose({
            parent: upperBar,
            onClick() {
                bg.remove();
            }
        })

        // imgDetail wird im if-Scope beschrieben
        let imgDetail

        let imgsOverview = [];
        // console.log(post.imgNames);

        if (post.imgNames.length > 0) {
            let path = `/getImg/${post.userID}/${post.imgNames[currentIndex]}`;

            imgDetail = dom.create({
                type: 'img',
                cssClassName: 'imgDetail',
                parent: container,
                attr: {
                    src: path
                },
                listeners: {
                    error() {
                        imgDetail.src = '/assets/img/404.png'
                    }
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
                    styles: {
                        width: `calc(${~~(100 / post.imgNames.length)}% - 10px)`
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
        // console.log('Post detail settings', settings, settings.user._id);

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

            // Post bearbeiten
            btn({
                legend: ln.editPost,
                parent: containerUI,
                isEncapsuled: false,
                onClick() {
                    addMedia(post);
                    bg.remove();
                }
            })
        }
        else {
            // Like
            const elLikes = compLikes({
                likes: post.likes,
                parent: containerUI,
                post,
                handleLiked(post) {
                    bg.remove();
                    postDetails.init(post);
                }

            })
        }
        // add comment
        btn({
            legend: ln.addComment,
            parent: containerUI,
            isEncapsuled: false,
            onClick() {
                let elPostComment = postComment({
                    parent: containerUI,
                    post
                })
                elPostComment.addEventListener('saved', evt => {

                    console.log('Event triggered from post ', evt.detail.comment);

                    ws.saveComment(evt.detail.comment).then(
                        () => {
                            // Post neu laden
                            console.log('Comment saved');
                            bg.remove();
                            postDetails.init(post);
                        }
                    )

                })
            }
        })

        // Kommentare anzeigen
        const containerComments = dom.create({
            parent: container,
            cssClassName: 'container containerComments'
        })

        Promise.all(
            post.comments.map(commentID => ws.getComment(commentID))
        ).then(
            comments => {
                comments
                    .toSorted((a, b) => b.crDate - a.crDate)
                    .forEach((comment, index) => {
                        // Für jeden Kommentar wird die comment-Komponente aufgerufen
                        // Diese hat eine eigene Eingabemaske für neue Kind-Kommentare
                        // Das Eintragen eines Kind-Kommentars triggert einen Event, der bis hierhin durchgereicht
                        // und hier verarbeitet wird 
                        const elComment = compComment({
                            payload: comment,
                            index,
                            parent: containerComments
                        })

                        elComment.addEventListener('saved', evt => {

                            console.log('Eltern-Post, Kommentar Layer 0');
                            console.log('Event triggered from comment ', evt.detail.comment);

                            ws.saveComment(evt.detail.comment).then(
                                () => {
                                    // Post neu laden
                                    console.log('Comment saved');
                                    bg.remove();
                                    postDetails.init(post);
                                }
                            )
                        })
                    }
                    )
            }
        )

    }
}

export default postDetails;