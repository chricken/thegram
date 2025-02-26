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

const comment = ({
    payload,
    index,
    parent
}) => {

    let ln = languages[settings.lang];

    const containerComment = dom.create({
        cssClassName: 'containerComment',
        parent,
       
    })

    const headerContainer = dom.create({
        type: 'div',
        parent: containerComment
    })

    dom.create({
        type: 'span',
        content: payload.title,
        parent: headerContainer,
        cssClassName: 'header'
    })

    dom.create({
        type: 'span',
        cssClassName: 'info',
        content: ' - created: ' + new Date(payload.crDate).toLocaleString(),
        parent: headerContainer
    })

    dom.create({
        type: 'p',
        content: payload.text,
        parent: containerComment
    })

    Promise.all(
        payload.comments.map(commentID => ws.getComment(commentID))
    ).then(
        comments => {
            comments
                .toSorted((a, b) => b.crDate - a.crDate)
                .forEach((comment, index) => {
                    console.log(index, comment.comments);

                    let elComment = compComment({
                        payload: comment,
                        index,
                        parent: containerComment
                    })

                    elComment.addEventListener('saved', () => {
                        // Event weiterleiten bis zu der Stelle, an der der Post neu gerendert werden kann
                        console.log('Event triggered', containerComment);

                        let myEvent = new CustomEvent('saved');
                        containerComment.dispatchEvent(myEvent);
                    })

                })
        }
    )


    btn({
        legend: ln.addComment,
        parent: containerComment,
        isEncapsuled: false,
        onClick() {

            let elPostComment = postComment({
                parent: containerComment,
                comment: payload
            })

            elPostComment.addEventListener('saved', () => {
                console.log('Event triggered', containerComment);

                // Event weiterleiten bis zu der Stelle, an der der Post neu gerendert werden kann
                let myEvent = new CustomEvent('saved');
                containerComment.dispatchEvent(myEvent);

            })
        }
    })
    return containerComment;
}

export default comment;