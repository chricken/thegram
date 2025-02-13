'use strict';

import dom from '../dom.js';
import languages from '../languages/all.js';
import button from './button.js';
import settings from '../settings.js';
import Comment from '../classes/Comment.js';
import ws from '../ws.js';

const postComment = ({
    parent = null,
    post = {},
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

    const taComment = dom.create({
        type: 'textarea',
        parent: container
    })

    button({
        legend: ln.send,
        parent: container,
        onClick() {
            console.log(settings.user._id);

            const comment = new Comment({
                text: taComment.value,
                user: settings.user,
                post
            })

            ws.saveComment(comment).then(
                res => {
                    console.log(res);
                }
            ).catch(
                console.warn
            )
        }
    })

}

export default postComment;