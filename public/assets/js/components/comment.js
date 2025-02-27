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

    // console.log('Kommentar', payload);

    const containerComment = dom.create({
        cssClassName: 'containerComment',
        parent,

    })

    const headerContainer = dom.create({
        type: 'div',
        parent: containerComment
    })

    const elUser = dom.create({
        parent: containerComment,
        cssClassName: 'commentUserName'
    })

    ws.getUser({ userID: payload.userID }).then(
        res => {
            // console.log(res);
            elUser.innerHTML = res.username;
        }
    )

    /* 
    // ID
    dom.create({
        type: 'p',
        content: payload._id,
        parent: headerContainer,
    })
    */

    // Header
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

    // Für jeden Kind-Kommentar die Komponente erneut aufrufen
    Promise.all(
        payload.comments.map(commentID => ws.getComment(commentID))
    ).then(
        comments => {
            comments
                .toSorted((a, b) => b.crDate - a.crDate)
                .forEach((comment, index) => {
                    // console.log(index, comment.comments);

                    let elComment = compComment({
                        payload: comment,
                        index,
                        parent: containerComment
                    })

                    // Auf das speichern eines Kommentares reagieren
                    elComment.addEventListener('saved', evt => {

                        // Event weiterleiten bis zu der Stelle, an der der Post neu gerendert werden kann
                        console.log('In der Verschachtelung event weiterleiten', containerComment);

                        // Den Kommentar entgegennehmen und an das Eltern-Element weiterreichen
                        let myEvent = new CustomEvent('saved', {
                            detail: {
                                comment: evt.detail.comment
                            }
                        });
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

            // Hier wird auf eine Nachricht vom Eingabefenster reagiert
            elPostComment.addEventListener('saved', (evt) => {
                console.log('Kommentar Layer n, Event triggered', evt.detail.comment);

                // Den Kommentar entgegennehmen und an das Eltern-Element weiterreichen
                let myEvent = new CustomEvent('saved', {
                    detail: {
                        comment: evt.detail.comment
                    }
                });
                containerComment.dispatchEvent(myEvent);

            })
        }
    })
    return containerComment;
}

export default comment;