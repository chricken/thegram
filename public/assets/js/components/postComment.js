'use strict';

import dom from '../dom.js';
import languages from '../languages/all.js';
import button from './button.js';
import settings from '../settings.js';
import Comment from '../classes/Comment.js';
import ws from '../ws.js';

const postComment = ({
    parent = null,
    post = null,
    comment = null
}) => {

    let ln = languages[settings.lang];

    const container = dom.create({
        parent,
        cssClassName: 'container'
    })

    dom.create({
        type: 'h5',
        content: ln.addComment,
        parent: container
    })

    const taTitle = dom.create({
        type: 'input',
        parent: container,
        attr: {
            placeholder: ln.titleContent
        }
    })

    dom.create({
        type: 'br',
        parent: container
    })

    const taComment = dom.create({
        type: 'textarea',
        parent: container,
        attr: {
            placeholder: ln.textContent
        }
    })

    button({
        legend: ln.send,
        parent: container,
        onClick() {
            // console.log('comment user ID', settings.user._id);

            const myComment = new Comment({
                title: taTitle.value,
                text: taComment.value,
                userID: settings.user._id,
                post,
                comment,
            })

            // Zum Elternelement durchreichen
            console.log('Dies wird der neue Kommentar', myComment);

            let myEvent = new CustomEvent('saved', {
                detail:{
                    comment:myComment
                }
            });
            container.dispatchEvent(myEvent);
            

            /* 
            ws.saveComment(myComment).then(
                payload => {
                    console.log('Neuer Post: ', payload);

                    let myEvent = new CustomEvent('saved');
                    container.dispatchEvent(myEvent);
                }
            ).catch(
                console.warn
            )
            */
        }
    })
    return container
}

export default postComment;